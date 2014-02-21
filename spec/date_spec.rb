# encoding: utf-8

require 'spec_helper'

describe DarianCalendar::Date do

  before do
    @earth_date = ::Date.new(2012, 10, 15)
    @mars_date  = DarianCalendar::Date.by_digits(214, 14, 26)
    @mars_date_json = '{"calendar_type":"Martiana","month":14,"month_name":"Mithuna","month_of_season":1,"season":2,"sol":26,"sol_of_season":53,"sol_of_year":387,"total_sols":143466,"week_sol":5,"week_sol_name":"Sol Jovis","year":214}'
  end

  describe 'attributes' do

    it 'aliases day to sol and week day to week sol' do
      @mars_date.day.should == @mars_date.sol
      @mars_date.week_day.should == @mars_date.week_sol
    end

    it 'verifies all attributes' do
      @mars_date.year.should  == 214
      @mars_date.month.should == 14
      @mars_date.sol.should   == 26

      @mars_date.total_sols.should      == 143466.0
      @mars_date.season.should          == 2
      @mars_date.sol_of_season.should   == 53
      @mars_date.month_of_season.should == 1
      @mars_date.sol_of_year.should     == 387
      @mars_date.week_sol.should        == 5
    end

  end

  describe 'class methods' do

    describe '.new' do
      context 'total sols are given' do
        it 'returns mars date by count of martian sols' do
          DarianCalendar::Date.new(@mars_date.total_sols).should == @mars_date
        end
      end
      context 'no sols are given' do
        it 'returns current mars date' do
          ::Date.stub(:today).and_return(@earth_date)
          DarianCalendar::Date.new.should == DarianCalendar::Date.today
        end
      end
    end

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
        ::Date.stub(:today).and_return(@earth_date)
        DarianCalendar::Date.today.should == DarianCalendar::Date.from_earth(@earth_date)
      end
    end

    describe '.from_json' do
      it 'parses a json string and creates a mars date' do
        DarianCalendar::Date.from_json(@mars_date_json).should == @mars_date
      end
    end

    describe '.by_digits' do
      context 'no digits are given' do
        it 'should raise an argument error' do
          expect{DarianCalendar::Date.by_digits}.to raise_error(ArgumentError, 'Invalid year')
        end
      end
      context 'invalid month is given' do
        it 'should raise an argument error' do
          expect{DarianCalendar::Date.by_digits(214, -5)}.to raise_error(ArgumentError, 'Invalid month')
        end
      end
      context 'invalid sol is given' do
        it 'should raise an argument error' do
          expect{DarianCalendar::Date.by_digits(214, 14, 35)}.to raise_error(ArgumentError, 'Invalid sol')
        end
      end
      context 'invalid sol for a month is given' do
        it 'should raise an argument error' do
          expect{DarianCalendar::Date.by_digits(214, 24, 28)}.to raise_error(ArgumentError, 'Invalid sol for this month')
        end
      end

      context 'only year is given' do
        it 'returns the first of the month 1 of the given year' do
          date = DarianCalendar::Date.by_digits(214)
          date.year.should  == 214
          date.month.should == 1
          date.sol.should   == 1
        end
      end
      context 'only year and month are given' do
        it 'returns the first of the given month and year' do
          date = DarianCalendar::Date.by_digits(214, 14)
          date.year.should  == 214
          date.month.should == 14
          date.sol.should   == 1
        end
      end
      context 'all digits are given' do
        it 'returns the date for the given digits' do
          date = DarianCalendar::Date.by_digits(214, 14, 26)
          date.year.should  == 214
          date.month.should == 14
          date.sol.should   == 26
        end
      end
    end

  end

  describe 'instance methods' do

    describe '#<=>' do
      it 'compares mars date objects' do
        same_date   = DarianCalendar::Date.by_digits(214, 14, 26)
        past_date   = DarianCalendar::Date.by_digits(214, 14, 25)
        future_date = DarianCalendar::Date.by_digits(214, 14, 27)

        @mars_date.should == same_date
        @mars_date.should >  past_date
        @mars_date.should <  future_date

        @mars_date.should_not < past_date
        @mars_date.should_not > future_date
      end
    end

    describe '#sols_in_year' do
      it 'returns the number of sols in a martian year' do
        leap_mars_date  = DarianCalendar::Date.by_digits(215)
        leap_mars_date.sols_in_year.should == 669
        @mars_date.sols_in_year.should     == 668
      end
    end

    describe '#leap?' do
      it 'returns if year is a leap year' do
        leap_mars_date  = DarianCalendar::Date.by_digits(215)
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
      context 'calendar type is ""' do
        it 'returns ""' do
          mars_date = DarianCalendar::Date.from_earth(@earth_date, :nothing)
          mars_date.week_sol_name.should == ''
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
      context 'calendar type is anything else' do
        it 'returns ""' do
          mars_date = DarianCalendar::Date.from_earth(@earth_date, :nothing)
          mars_date.month_name.should == ''
        end
      end
    end

  end

end

