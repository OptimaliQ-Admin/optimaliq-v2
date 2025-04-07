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
    <div className="relative flex items-center mb-4">
      <div className="flex-grow border-t border-gray-300"></div>
      <span className="px-3 text-sm text-gray-600 font-semibold bg-white z-10">
        {title}
        {tooltip && (
          <>
            <InformationCircleIcon
              className="w-4 h-4 inline ml-1 text-gray-400 hover:text-gray-600 cursor-pointer"
              data-tooltip-id={id}
            />
            <Tooltip id={id} place="top" content={tooltip} />
          </>
        )}
      </span>
      <div className="flex-grow border-t border-gray-300"></div>
    </div>
  );
}
