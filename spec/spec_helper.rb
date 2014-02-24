# encoding: utf-8

require 'simplecov'
require 'coveralls'

SimpleCov.formatter = SimpleCov::Formatter::MultiFormatter[
  SimpleCov::Formatter::HTMLFormatter,
  Coveralls::SimpleCov::Formatter
]

SimpleCov.start do
  add_filter '/spec/'
  minimum_coverage(90.0)
end

require 'time'
require 'date'
require 'json'
require Pathname(__FILE__).dirname.join('../lib/darian_calendar').to_s
