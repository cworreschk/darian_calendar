source "https://rubygems.org"

group :development do
  gem 'yard'
  gem 'redcarpet'
end

group :development, :test do
  gem 'rake'
end

group :test do
  gem 'rspec'
  gem 'simplecov'
  gem 'coveralls', :require => false
end

platforms :rbx do
  gem 'racc'
  gem 'rubysl', '~> 2.0'
  gem 'psych'
end