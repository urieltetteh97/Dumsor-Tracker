/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect, useMemo } from 'react';
import { format, isWithinInterval, parse, addHours, subMinutes } from 'date-fns';
import { DUMSOR_SCHEDULE, TIME_SLOTS, Group, TIME_SLOTS as SLOTS } from '../data/dumsorData';

export function useDumsor() {
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 60000);
    return () => clearInterval(timer);
  }, []);

  const currentStatus = useMemo(() => {
    const todayStr = format(now, "yyyy-MM-dd");
    const schedule = DUMSOR_SCHEDULE[todayStr];
    
    if (!schedule) return null;

    const currentTimeStr = format(now, "HH:mm");
    
    let currentSlotIndex = -1;
    for (let i = 0; i < SLOTS.length; i++) {
      const slot = SLOTS[i];
      const start = parse(slot.start, "HH:mm", now);
      let end = parse(slot.end, "HH:mm", now);
      
      // Handle the 00:00 end case
      if (slot.end === "00:00") {
        end = addHours(start, 6);
      }

      if (isWithinInterval(now, { start, end })) {
        currentSlotIndex = i;
        break;
      }
    }

    if (currentSlotIndex === -1) return null;

    const currentGroupOff = schedule[currentSlotIndex];
    
    // Check for next outage
    let nextOutage = null;
    let nextSlotIndex = (currentSlotIndex + 1) % 4;
    let nextDate = now;
    if (nextSlotIndex === 0) {
      nextDate = addHours(now, 6); // roughly next day
    }
    const nextDateStr = format(nextDate, "yyyy-MM-dd");
    const nextSchedule = DUMSOR_SCHEDULE[nextDateStr];
    
    if (nextSchedule) {
      const nextGroupOff = nextSchedule[nextSlotIndex];
      const nextSlot = SLOTS[nextSlotIndex];
      const nextStart = parse(nextSlot.start, "HH:mm", nextDate);
      nextOutage = {
        group: nextGroupOff,
        time: nextSlot.start,
        startTime: nextStart
      };
    }

    return {
      currentGroupOff,
      currentTimeSlot: SLOTS[currentSlotIndex],
      nextOutage,
      now
    };
  }, [now]);

  return currentStatus;
}
