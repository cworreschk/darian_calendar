# encoding: utf-8

require 'spec_helper'

describe DarianCalendar::Date do

  before do
    @earth_date = ::Date.new(2012, 10, 15)
    @mars_date  = DarianCalendar::Date.from_earth(@earth_date)
    @mars_date_json = '{"calendar_type":"Martiana","total_sols":143466.15767923463,"year":214,"season":2,"sol_of_season":53,"month_of_season":1,"sol_of_year":387,"month":14,"sol":26,"week_sol":5,"week_sol_name":"Sol Jovis","month_name":"Mithuna"}'
  end

  describe 'attributes' do

    it 'aliases day to sol and week day to week sol' do
      @mars_date.day.should == @mars_date.sol
      @mars_date.week_day.should == @mars_date.week_sol
    end

  end

  describe 'initialize method' do
    it 'converts earth date to mars date' do
      @mars_date.year.should  == 214
      @mars_date.month.should == 14
      @mars_date.sol.should   == 26

      @mars_date.total_sols.should      == 143466.15767923463
      @mars_date.season.should          == 2
      @mars_date.sol_of_season.should   == 53
      @mars_date.month_of_season.should == 1
      @mars_date.sol_of_year.should     == 387
      @mars_date.week_sol.should        == 5
    end
  end

  describe 'class methods' do

    describe '.from_earth' do
      it 'converts an earth date to a mars date' do
        DarianCalendar::Date.from_earth(@earth_date).should == @mars_date
      end
    end

    describe '.parse_earth' do
      it 'parses earth date and converts it to mars date' do
        DarianCalendar::Date.parse_earth('2012-10-15').should == @mars_date
      end
    end

    describe '.today' do
      it 'returns current mars date' do
        ::Date.should_receive(:today).and_return(@earth_date)
        DarianCalendar::Date.today.should == DarianCalendar::Date.from_earth(@earth_date)
      end
    end

    describe '.from_json' do
      it 'parses a json string and creates a mars date' do
        DarianCalendar::Date.from_json(@mars_date_json).should == @mars_date
      end
    end

  end

  describe 'instance methods' do

    describe '#<=>' do
      it 'compares mars date objects' do
        same_date   = DarianCalendar::Date.from_earth(Date.new(2012, 10, 15))
        past_date   = DarianCalendar::Date.from_earth(Date.new(2012, 10, 14))
        future_date = DarianCalendar::Date.from_earth(Date.new(2012, 10, 16))

        @mars_date.should == same_date
        @mars_date.should >  past_date
        @mars_date.should <  future_date

        @mars_date.should_not < past_date
        @mars_date.should_not > future_date
      end
    end

    describe '#sols_in_year' do
      it 'returns the number of sols in a martian year' do
        leap_mars_date  = DarianCalendar::Date.from_earth(Date.new(2013, 10, 15))
        leap_mars_date.sols_in_year.should == 669
        @mars_date.sols_in_year.should     == 668
      end
    end

    describe '#leap?' do
      it 'returns if year is a leap year' do
        leap_mars_date  = DarianCalendar::Date.from_earth(Date.new(2013, 10, 15))
        leap_mars_date.leap?.should == true
        @mars_date.leap?.should     == false
      end
    end

    describe '#to_earth' do
      it 'converts mars date to earth date' do
        @earth_date == @mars_date.to_earth
      end
    end

    describe '#to_s' do
      it 'converts mars date to string' do
        @mars_date.to_s.should == '214-14-26'
      end
    end

    describe '#to_json' do
      it 'converts mars date to a json string' do
        @mars_date.to_json.should == @mars_date_json
      end
    end

    describe '#as_json' do
      it 'converts mars date to json' do
        @mars_date.as_json.should == JSON::parse(@mars_date_json)
      end
    end

    describe '#week_sol_name' do
      context 'calendar type is not set' do
        it 'returns "Sol Jovis"' do
          @mars_date.week_sol_name.should == 'Sol Jovis'
        end
      end
      context 'calendar type is "Martina"' do
        it 'returns "Sol Jovis"' do
          mars_date = DarianCalendar::Date.from_earth(@earth_date, DarianCalendar::CalendarTypes::MARTIANA)
          mars_date.week_sol_name.should == 'Sol Jovis'
        end
      end
      context 'calendar type is "Defrost"' do
        it 'returns "Erjasol"' do
          mars_date = DarianCalendar::Date.from_earth(@earth_date, DarianCalendar::CalendarTypes::DEFROST)
          mars_date.week_sol_name.should == 'Erjasol'
        end
      end
      context 'calendar type is "Areosynchronous"' do
        it 'returns "Venusol"' do
          mars_date = DarianCalendar::Date.from_earth(@earth_date, DarianCalendar::CalendarTypes::AREOSYNCHRONOUS)
          mars_date.week_sol_name.should == 'Venusol'
        end
      end
      context 'calendar type is "Hensel"' do
        it 'returns "Sol Jovis"' do
          mars_date = DarianCalendar::Date.from_earth(@earth_date, DarianCalendar::CalendarTypes::HENSEL)
          mars_date.week_sol_name.should == 'Sol Jovis'
        end
      end
      context 'calendar type is "Aqua"' do
        it 'returns "5"' do
          mars_date = DarianCalendar::Date.from_earth(@earth_date, DarianCalendar::CalendarTypes::AQUA)
          mars_date.week_sol_name.should == '5'
        end
      end
    end

    describe '#month_name' do
      context 'calendar type is not set' do
        it 'returns "Mithuna"' do
          @mars_date.month_name.should == 'Mithuna'
        end
      end
      context 'calendar type is "Martina"' do
        it 'returns "Mithuna"' do
          mars_date = DarianCalendar::Date.from_earth(@earth_date, DarianCalendar::CalendarTypes::MARTIANA)
          mars_date.month_name.should == 'Mithuna'
        end
      end
      context 'calendar type is "Defrost"' do
        it 'returns "Neturima"' do
          mars_date = DarianCalendar::Date.from_earth(@earth_date, DarianCalendar::CalendarTypes::DEFROST)
          mars_date.month_name.should == 'Neturima'
        end
      end
      context 'calendar type is "Areosynchronous"' do
        it 'returns "Neturima"' do
          mars_date = DarianCalendar::Date.from_earth(@earth_date, DarianCalendar::CalendarTypes::AREOSYNCHRONOUS)
          mars_date.month_name.should == 'Neturima'
        end
      end
      context 'calendar type is "Hensel"' do
        it 'returns "Duautumn"' do
          mars_date = DarianCalendar::Date.from_earth(@earth_date, DarianCalendar::CalendarTypes::HENSEL)
          mars_date.month_name.should == 'Duautumn'
        end
      end
      context 'calendar type is "Aqua"' do
        it 'returns "14"' do
          mars_date = DarianCalendar::Date.from_earth(@earth_date, DarianCalendar::CalendarTypes::AQUA)
          mars_date.month_name.should == '14'
        end
      end
    end

  end

end

