# encoding: utf-8

require 'spec_helper'

describe DarianCalendar::Time do

  before do
    @earth_time = Time.utc(2012, 10, 15, 16, 50, 0)
    @mars_time  = DarianCalendar::Time.from_earth(@earth_time)
  end

  describe 'attributes' do

    it 'aliases day to sol and week day to week sol' do
      @mars_time.day.should == @mars_time.sol
      @mars_time.week_day.should == @mars_time.week_sol
    end

  end

  describe 'initialize method' do
    it 'converts earth time to mars time' do
      @mars_time.year.should  == 214
      @mars_time.month.should == 14
      @mars_time.sol.should   == 26
      @mars_time.hour.should  == 20
      @mars_time.min.should   == 10
      @mars_time.sec.should   == 2

      @mars_time.total_sols.should      == 143466.84030197054
      @mars_time.season.should          == 2
      @mars_time.sol_of_season.should   == 53
      @mars_time.month_of_season.should == 1
      @mars_time.sol_of_year.should     == 387
      @mars_time.week_sol.should        == 5
    end
  end

  describe 'class methods' do

    describe '.total_sols' do
      it 'returns total sols from earth time' do
        sols = DarianCalendar::Time.sols_from_earth_time(@earth_time)
        sols.should == @mars_time.total_sols
      end
    end

    describe '.parse_earth' do
      it 'parses earth time and converts it to mars time' do
        DarianCalendar::Time.parse_earth('2012-10-15 16:50:00 UTC').should == @mars_time
      end
    end

    describe '.now' do
      it 'returns current mars time' do
        Time.should_receive(:now).and_return(@earth_time)
        DarianCalendar.now.should == DarianCalendar::Time.from_earth(@earth_time)
      end
    end

  end

  describe 'instance methods' do

    describe '#<=>' do
      it 'compares mars time objects' do
        same_time   = DarianCalendar::Time.from_earth(Time.utc(2012, 10, 15, 16, 50, 0))
        past_time   = DarianCalendar::Time.from_earth(Time.utc(2012, 10, 15, 16, 49, 59))
        future_time = DarianCalendar::Time.from_earth(Time.utc(2012, 10, 15, 16, 50, 1))

        @mars_time.should == same_time
        @mars_time.should >  past_time
        @mars_time.should <  future_time

        @mars_time.should_not < past_time
        @mars_time.should_not > future_time
      end
    end

    describe '#sols_in_year' do
      it 'returns the count of sols in a martian year' do
        leap_mars_time  = DarianCalendar::Time.from_earth(Time.utc(2013, 10, 15, 16, 50, 0))
        leap_mars_time.sols_in_year.should == 669
        @mars_time.sols_in_year.should     == 668
      end
    end

    describe '#leap?' do
      it 'returns if year is a leap year' do
        leap_mars_time  = DarianCalendar::Time.from_earth(Time.utc(2013, 10, 15, 16, 50, 0))
        leap_mars_time.leap?.should == true
        @mars_time.leap?.should     == false
      end
    end

    describe '#to_earth' do
      it 'converts mars time to earth time' do
        @earth_time == @mars_time.to_earth
      end
    end

    describe '#to_s' do
      it 'converts mars time to string' do
        @mars_time.to_s.should == '214-14-26 20:10:02'
      end
    end

    describe '#week_sol_name' do
      context 'calendar type is not set' do
        it 'returns "Sol Jovis"' do
          @mars_time.week_sol_name.should == 'Sol Jovis'
        end
      end
      context 'calendar type is "Martina"' do
        it 'returns "Sol Jovis"' do
          mars_time = DarianCalendar::Time.from_earth(@earth_time, DarianCalendar::CalendarTypes::MARTIANA)
          mars_time.week_sol_name.should == 'Sol Jovis'
        end
      end
      context 'calendar type is "Defrost"' do
        it 'returns "Erjasol"' do
          mars_time = DarianCalendar::Time.from_earth(@earth_time, DarianCalendar::CalendarTypes::DEFROST)
          mars_time.week_sol_name.should == 'Erjasol'
        end
      end
      context 'calendar type is "Areosynchronous"' do
        it 'returns "Venusol"' do
          mars_time = DarianCalendar::Time.from_earth(@earth_time, DarianCalendar::CalendarTypes::AREOSYNCHRONOUS)
          mars_time.week_sol_name.should == 'Venusol'
        end
      end
      context 'calendar type is "Hensel"' do
        it 'returns "Sol Jovis"' do
          mars_time = DarianCalendar::Time.from_earth(@earth_time, DarianCalendar::CalendarTypes::HENSEL)
          mars_time.week_sol_name.should == 'Sol Jovis'
        end
      end
      context 'calendar type is "Aqua"' do
        it 'returns "5"' do
          mars_time = DarianCalendar::Time.from_earth(@earth_time, DarianCalendar::CalendarTypes::AQUA)
          mars_time.week_sol_name.should == '5'
        end
      end
    end

    describe '#month_name' do
      context 'calendar type is not set' do
        it 'returns "Mithuna"' do
          @mars_time.month_name.should == 'Mithuna'
        end
      end
      context 'calendar type is "Martina"' do
        it 'returns "Mithuna"' do
          mars_time = DarianCalendar::Time.from_earth(@earth_time, DarianCalendar::CalendarTypes::MARTIANA)
          mars_time.month_name.should == 'Mithuna'
        end
      end
      context 'calendar type is "Defrost"' do
        it 'returns "Neturima"' do
          mars_time = DarianCalendar::Time.from_earth(@earth_time, DarianCalendar::CalendarTypes::DEFROST)
          mars_time.month_name.should == 'Neturima'
        end
      end
      context 'calendar type is "Areosynchronous"' do
        it 'returns "Neturima"' do
          mars_time = DarianCalendar::Time.from_earth(@earth_time, DarianCalendar::CalendarTypes::AREOSYNCHRONOUS)
          mars_time.month_name.should == 'Neturima'
        end
      end
      context 'calendar type is "Hensel"' do
        it 'returns "Duautumn"' do
          mars_time = DarianCalendar::Time.from_earth(@earth_time, DarianCalendar::CalendarTypes::HENSEL)
          mars_time.month_name.should == 'Duautumn'
        end
      end
      context 'calendar type is "Aqua"' do
        it 'returns "14"' do
          mars_time = DarianCalendar::Time.from_earth(@earth_time, DarianCalendar::CalendarTypes::AQUA)
          mars_time.month_name.should == '14'
        end
      end
    end

  end



end

