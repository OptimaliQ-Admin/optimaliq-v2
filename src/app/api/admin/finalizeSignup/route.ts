import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

export async function POST(req: Request) {
  try {
    const { email, password, timezone, linkedin_url, agreed_terms, agreed_marketing } = await req.json();

    if (!email || !password) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // ✅ 1. Buscar usuario en tier2_users
    const { data: tier2User, error: tier2Error } = await supabaseAdmin
      .from("tier2_users")
      .select("*")
      .eq("email", email)
      .single();

    if (tier2Error || !tier2User) {
      console.error("❌ No se encontró el usuario en tier2_users:", tier2Error);
      return NextResponse.json({ error: "User not found in tier2_users" }, { status: 404 });
    }

    // ✅ 2. Buscar usuario en Supabase Auth
    const { data: userList, error: listError } = await supabaseAdmin.auth.admin.listUsers();
    if (listError || !userList?.users) {
      console.error("❌ Error al listar usuarios:", listError);
      return NextResponse.json({ error: "Failed to list users" }, { status: 500 });
    }

    let authUser = userList.users.find((user) => user.email?.toLowerCase() === email.toLowerCase());

    if (!authUser) {
      console.log("👤 Usuario no existe en Auth. Creando usuario nuevo...");

      const { data: createdUser, error: createError } = await supabaseAdmin.auth.admin.createUser({
        email,
        password,
        email_confirm: true,
      });

      if (createError || !createdUser?.user) {
        console.error("❌ Error al crear usuario en Auth:", createError);
        return NextResponse.json({ error: "Failed to create user in auth" }, { status: 500 });
      }

      authUser = createdUser.user;
    }

    // ✅ 3. Actualizar contraseña
    const { error: updatePasswordError } = await supabaseAdmin.auth.admin.updateUserById(authUser.id, {
      password,
    });

    if (updatePasswordError) {
      console.error("❌ Error al actualizar contraseña:", updatePasswordError);
      return NextResponse.json({ error: "Failed to update password" }, { status: 500 });
    }

    // ✅ 4. Insertar datos en tabla 'users'
    const { error: insertError } = await supabaseAdmin.from("users").insert({
      u_id: authUser.id, // UUID del auth
      name: `${tier2User.first_name} ${tier2User.last_name}`,
      email: tier2User.email,
      role: tier2User.title,
      companysize: tier2User.company_size,
      revenuerange: tier2User.revenue_range,
      industry: tier2User.industry,
    });

    if (insertError) {
      console.error("❌ Error al insertar en users:", insertError);
      return NextResponse.json({ error: "Failed to insert into users table" }, { status: 500 });
    }

    // ✅ 5. Actualizar tier2_users con user ID y nuevos datos
    const { error: updateTier2Error } = await supabaseAdmin
      .from("tier2_users")
      .update({
        u_id: authUser.id,
        timezone,
        linkedin_url,
        agreed_terms,
        agreed_marketing,
      })
      .eq("email", email);

    if (updateTier2Error) {
      console.error("❌ Error al actualizar tier2_users:", updateTier2Error);
      return NextResponse.json({ error: "Failed to update tier2_users" }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("❌ Error inesperado:", error);
    return NextResponse.json({ error: "Unexpected server error" }, { status: 500 });
  }
}
