# Darian Calendar

[![Build Status](https://travis-ci.org/marsec/darian_calendar.png)](https://travis-ci.org/marsec/darian_calendar)

_The [Darian calendar] is a proposed system of time-keeping designed to serve the needs of any possible future human settlers on the planet Mars.
It was created by aerospace engineer and political scientist Thomas Gangale in 1985 and named by him after his son Darius._ ([Wikipedia])

This Ruby library converts earth time to mars time and back again. You can choose between 5 variants of the Darian calendar system; _Martiana_, _Defrost_, _Areosynchronous_, _Hensel_ and _Aqua_.

It's based on the [JavaScript Converter] by Thomas Gangale.

[Wikipedia]: http://en.wikipedia.org/wiki/Darian_calendar
[Darian calendar]: http://en.wikipedia.org/wiki/Darian_calendar
[JavaScript Converter]: http://pweb.jps.net/~tgangale/mars/converter/calendar_clock.htm

## Installation

In Bundler:
```ruby
gem "darian_calendar"
```

Otherwise:
```bash
[sudo|rvm] gem install darian_calendar
```

## Usage

```ruby
require 'darian_calendar'
```

```ruby
mars_time = DarianCalendar.now
mars_time = DarianCalendar.now(DarianCalendar::CalendarTypes::DEFROST)

mars_time = DarianCalendar::Time.now
mars_time = DarianCalendar::Time.now(DarianCalendar::CalendarTypes::AREOSYNCHRONOUS)

mars_time = DarianCalendar::Time.from_earth(Time.utc(2012, 10, 15, 16, 50, 0))
mars_time = DarianCalendar::Time.from_earth(Time.utc(2012, 10, 15, 16, 50, 0), DarianCalendar::CalendarTypes::AQUA)

mars_time = DarianCalendar::Time.parse_earth('2012-10-15 16:50:00 UTC')
mars_time = DarianCalendar::Time.parse_earth('2012-10-15 16:50:00 UTC', DarianCalendar::CalendarTypes::MARTIANA)
```

```ruby
mars_time.to_s #=> '214-14-26 20:10:02'

mars_time.year  #=> 214
mars_time.month #=> 14
mars_time.sol   #=> 26
mars_time.hour  #=> 20
mars_time.min   #=> 10
mars_time.sec   #=> 2

mars_time.total_sols      #=> 143466.84030197054
mars_time.season          #=> 2
mars_time.sol_of_season   #=> 53
mars_time.month_of_season #=> 1
mars_time.sol_of_year     #=> 387
mars_time.week_sol        #=> 5

mars_time.month_name      #=> 'Sol Jovis'
mars_time.week_sol_name   #=> 'Mithuna'
```

```ruby
mars_time = DarianCalendar::Time.from_earth(Time.utc(2012, 10, 15, 16, 50, 0))
mars_time.to_earth #=> 2012-10-15 16:50:00 UTC
```

```ruby
DarianCalendar::CalendarTypes::MARTIANA #=> Default
DarianCalendar::CalendarTypes::DEFROST
DarianCalendar::CalendarTypes::AREOSYNCHRONOUS
DarianCalendar::CalendarTypes::HENSEL
DarianCalendar::CalendarTypes::AQUA
```

## Testing

Unit tests are provided for all of Darian Calendar's methods:

```bash
# From anywhere in the project directory:
bundle exec rspec
```

## License

This Darian Calendar Ruby Gem is released under the [European Union Public Licence V. 1.1](http://opensource.org/licenses/EUPL-1.1).
