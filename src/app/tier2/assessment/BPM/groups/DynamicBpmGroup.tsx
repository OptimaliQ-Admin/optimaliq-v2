import MultipleChoiceQuestion from "@/components/questions/MultipleChoiceQuestion";
import MultiSelectQuestion from "@/components/questions/MultiSelectQuestion";
import TextAreaQuestion from "@/components/questions/TextAreaQuestion";

export default function DynamicBpmGroup({ questions, answers, onAnswer }: any) {
  return (
    <div className="p-6 max-w-2xl mx-auto space-y-6">
      {questions.map((q: any) => {
        const value = answers[q.id] || "";
        const options = q.options ? JSON.parse(q.options) : [];

        switch (q.question_type) {
            case "multiple_choice":
  return (
    <MultipleChoiceQuestion
      question={q.question_text}
      options={options}
      value={typeof value === "string" ? value : ""} // ⬅ ensure value is a string
      onChange={(val) => onAnswer(q.id, val)}
    />
  );

          case "multi_select":
            return (
              <MultiSelectQuestion
             
                question={q.question_text}
                options={options}
                selected={value || []}
                onChange={(val) => onAnswer(q.id, val)}
                maxSelect={3}
              />
            );
          case "text_area":
            return (
                <TextAreaQuestion
               
                question={q.question_text}
                value={value}
                onChange={(val) => onAnswer(q.id, val)}
                placeholder={q.placeholder || ""}
                maxLength={q.max_length || 300}
              />
            );
          default:
            return null;
        }
      })}
    </div>
  );
}
