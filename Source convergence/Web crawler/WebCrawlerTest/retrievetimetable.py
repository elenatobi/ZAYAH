from dataclasses import dataclass
from typing import Optional, List
import datetime

@dataclass
class CalendarRecurrence:
    timedelta: datetime.timedelta
    count: Optional[int] = None

@dataclass
class CalendarEvent:
    start_time: datetime.datetime
    end_time: datetime.datetime
    title: str
    description: Optional[str] = None
    recurrence: Optional[CalendarRecurrence] = None

class Calendar:
    events: Optional[List[CalendarEvent]] = list()

    def add_event(self, event):
        self.events.append(event)

    def remove_event(self, event):
        self.events.remove(event)

    def view_period(self, start_time, end_time) -> List[CalendarEvent]:
        pass

def main() -> None:
    e1 = CalendarEvent(
        start_time = datetime.datetime(2025, 1, 27, 12, 23, 55),
        end_time = datetime.datetime(2025, 1, 27, 13, 21, 30),
        title = "Demo event",
        description = "Demo description",
        recurrence = CalendarRecurrence(
            timedelta = datetime.timedelta(5),
            count = 5
        )
    )
    c = Calendar()
    print(e1)