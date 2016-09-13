# Darian Calendar

[![Gem Version](https://img.shields.io/gem/v/uikit-sass-rails.svg?style=flat-square)](https://rubygems.org/gems/darian_calendar)
[![Build Status](http://img.shields.io/travis/cworreschk/darian_calendar.svg?style=flat-square)](https://travis-ci.org/cworreschk/darian_calendar)
[![Coverage Status](http://img.shields.io/coveralls/cworreschk/darian_calendar.svg?style=flat-square)](https://coveralls.io/r/cworreschk/darian_calendar)
[![License](https://img.shields.io/badge/license-MIT-red.svg?style=flat-square)](https://github.com/cworreschk/darian_calendar/blob/master/LICENSE.md)

_The [Darian calendar] is a proposed system of time-keeping designed to serve the needs of any possible future human settlers on the planet Mars.
It was created by aerospace engineer and political scientist Thomas Gangale in 1985 and named by him after his son Darius._ ([Wikipedia])

This Ruby library converts earth time to mars time and back again. You can choose between 5 variants of the Darian calendar system; _Martiana_, _Defrost_, _Areosynchronous_, _Hensel_ and _Aqua_.

It's based on the [JavaScript Converter] which was developed by Alan Hensel and Thomas Gangale.

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

### Date
```ruby
mars_date = DarianCalendar.today
mars_date = DarianCalendar::Date.today
mars_date = DarianCalendar::Time.now.to_date
mars_date = DarianCalendar::Date.by_digits(214, 14, 26)
mars_date = DarianCalendar::Date.parse_earth('2012-10-15')
mars_date = DarianCalendar::Date.from_earth(Date.new(2012, 10, 15))
```

### Time
```ruby
mars_time = DarianCalendar.now
mars_time = DarianCalendar::Time.now
mars_time = DarianCalendar::Time.by_digits(214, 14, 26, 20, 12, 2)
mars_time = DarianCalendar::Time.parse_earth('2012-10-15 16:50:00 UTC')
mars_time = DarianCalendar::Time.from_earth(Time.utc(2012, 10, 15, 16, 50, 0))
```

### Attributes/Methods
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

### Convert back to earth time
```ruby
mars_date = DarianCalendar::Date.by_digits(2012, 10, 15)
mars_date.to_earth #=> 2012-10-15

mars_time = DarianCalendar::Time.from_earth(Time.utc(2012, 10, 15, 16, 50, 0))
mars_time.to_earth #=> 2012-10-15 16:50:00 UTC
```

### Variants of the Darian Calendar System
```ruby
DarianCalendar::CalendarTypes::MARTIANA #=> Default
DarianCalendar::CalendarTypes::DEFROST
DarianCalendar::CalendarTypes::AREOSYNCHRONOUS
DarianCalendar::CalendarTypes::HENSEL
DarianCalendar::CalendarTypes::AQUA
```
```ruby
# How to use
mars_date = DarianCalendar::Date.by_digits(214, 14, 26, DarianCalendar::CalendarTypes::AREOSYNCHRONOUS)
mars_time = DarianCalendar.now(DarianCalendar::CalendarTypes::DEFROST)
```

## Supported Ruby Interpreters

This library aims to support and is [tested](https://travis-ci.org/cworreschk/darian_calendar) against the following Ruby interpreters and versions:

- MRI 1.9.2
- MRI 1.9.3
- MRI 2.0.0
- MRI 2.1.0
- JRuby
- Rubinius

## Testing

Unit tests are provided for all of Darian Calendar's methods:

```bash
# From anywhere in the project directory:
bundle exec rspec
```

## Copyright
- _The Darian Calendar Ruby Gem_ is Copyright © 2014 by Christian Worreschk.
- _The Darian System_ is Copyright © 1986-2005 by Thomas Gangale

## License
This Darian Calendar Ruby Gem is released under the [MIT Licence](http://opensource.org/licenses/MIT).
