import Form_1_0 from "./groups/score_1";
import Form_1_5 from "./groups/score_1.5";
import Form_2_0 from "./groups/score_2";
import Form_2_5 from "./groups/score_2.5";
import Form_3_0 from "./groups/score_3";
import Form_3_5 from "./groups/score_3.5";
import Form_4_0 from "./groups/score_4";
import Form_4_5 from "./groups/score_4.5";
import Form_5_0 from "./groups/score_5";

export const bpmFormMap: Record<string, React.ComponentType<any>> = {
  "1.0": Form_1_0,
  "1.5": Form_1_5,
  "2.0": Form_2_0,
  "2.5": Form_2_5,
  "3.0": Form_3_0,
  "3.5": Form_3_5,
  "4.0": Form_4_0,
  "4.5": Form_4_5,
  "5.0": Form_5_0,
};
