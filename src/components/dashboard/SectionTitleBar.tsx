"use client";

import { InformationCircleIcon } from "@heroicons/react/24/outline";
import { Tooltip } from "react-tooltip";

type SectionTitleBarProps = {
  title: string;
  tooltip?: string;
};

export default function SectionTitleBar({ title, tooltip }: SectionTitleBarProps) {
  const id = title.replace(/\s+/g, "-").toLowerCase(); // unique ID for tooltip

  return (
    <div className="w-full bg-gray-100 px-4 py-2 rounded-md flex items-center">
      <span className="text-base font-bold text-gray-800 flex items-center">
        {title}
        {tooltip && (
          <>
            <InformationCircleIcon
              className="w-5 h-5 ml-2 text-gray-400 hover:text-gray-600 cursor-pointer"
              data-tooltip-id={id}
            />
            <Tooltip id={id} place="top" content={tooltip} />
          </>
        )}
      </span>
    </div>
  );
}
