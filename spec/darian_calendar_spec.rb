# encoding: utf-8

require 'spec_helper'

describe DarianCalendar do

  describe 'class methods' do

    describe '#now' do
      it 'returns current mars time' do
        earth = Time.utc(2012, 10, 15, 16, 50, 0)
        Time.should_receive(:now).and_return(earth)
        DarianCalendar.now.should == DarianCalendar::Time.from_earth(earth)
      end
    end
  end

end
