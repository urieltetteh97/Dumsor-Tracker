/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { DUMSOR_SCHEDULE, TIME_SLOTS } from '../data/dumsorData';
import { format, parse } from 'date-fns';

export default function ScheduleTable() {
  const dates = Object.keys(DUMSOR_SCHEDULE).sort();

  return (
    <div className="overflow-x-auto rounded-2xl border border-neutral-200">
      <table className="w-full text-sm text-left">
        <thead className="text-xs text-neutral-500 uppercase bg-neutral-50 border-b border-neutral-200">
          <tr>
            <th className="px-4 py-3 font-semibold">Period / Date</th>
            {dates.map(date => (
              <th key={date} className="px-4 py-3 font-semibold text-center">
                {format(parse(date, "yyyy-MM-dd", new Date()), "EEE, dd/MM")}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-neutral-200">
          {TIME_SLOTS.map((slot, slotIndex) => (
            <tr key={slotIndex} className="bg-white">
              <td className="px-4 py-4 whitespace-nowrap">
                <span className="font-bold text-neutral-900 block">{slot.label}</span>
                <span className="text-neutral-500 text-xs italic">({slot.start} - {slot.end})</span>
              </td>
              {dates.map(date => {
                const group = DUMSOR_SCHEDULE[date][slotIndex];
                return (
                  <td key={date + slotIndex} className="px-4 py-4 text-center">
                    <span className={`inline-flex items-center justify-center w-10 h-10 rounded-xl font-bold ${
                      group === 'A' ? 'bg-amber-100 text-amber-700' :
                      group === 'B' ? 'bg-blue-100 text-blue-700' :
                      'bg-emerald-100 text-emerald-700'
                    }`}>
                      {group}
                    </span>
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
