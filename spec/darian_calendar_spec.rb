# encoding: utf-8

require 'spec_helper'

describe DarianCalendar do

  describe 'logical expections' do
    it 'should compare if Date.today and Time.today are equal ' do
      DarianCalendar::Date.today.should == DarianCalendar::Time.today
    end
  end

  describe 'class methods' do

    #def sols_from_earth(earth_date_time)
    #  seconds = earth_date_time.is_a?(::Date) ? earth_date_time.strftime("%s").to_f : earth_date_time.to_f
    #  days = (seconds / SECONDS_A_DAY) + E_DAYS_TIL_UNIX
    #  sols = (days - EPOCH_OFFSET) / MARS_TO_EARTH_DAYS
    #  return sols
    #end
    describe '.sols_from_earth' do
      context 'parameter is a date object' do
        it 'returns the total number of martian sols' do
          earth = ::Date.new(2012, 10, 15)
          DarianCalendar.sols_from_earth(earth).should == 143466.15767923463
        end
      end
      context 'parameter is a time object' do
        it 'returns the total number of martian sols' do
          earth = ::Time.utc(2012, 10, 15, 16, 50, 0)
          DarianCalendar.sols_from_earth(earth).should == 143466.84030197054
        end
      end
    end

    describe '.now' do
      it 'returns current mars time' do
        earth = ::Time.utc(2012, 10, 15, 16, 50, 0)
        ::Time.should_receive(:now).and_return(earth)
        DarianCalendar.now.should == DarianCalendar::Time.from_earth(earth)
      end
    end

    describe '.today' do
      it 'returns current mars date' do
        earth = ::Date.new(2012, 10, 15)
        ::Date.should_receive(:today).and_return(earth)
        DarianCalendar.today.should == DarianCalendar::Date.from_earth(earth)
      end
    end

    describe '.is_mars_leap_year?' do
      it 'returns if year is a leap year' do
        DarianCalendar::is_mars_leap_year?(214).should == false
        DarianCalendar::is_mars_leap_year?(215).should == true
      end
    end
  end

end
