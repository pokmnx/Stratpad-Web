#!/bin/bash

# prepare handlebars templates from html in templates dir
python prepareTemplates.py

# compile templates using handlebars
handlebars webapp/templates/ > webapp/scripts/templates.js

# compile scss into css (looks for config.rb in this dir)
compass compile . --boring

# deploy to build dir and minimize
node r.js -o app.build.js

# clean up
rm -f webapp/templates/*.handlebars
# rm -f webapp/scripts/templates.js
rm -rf webapp/css
