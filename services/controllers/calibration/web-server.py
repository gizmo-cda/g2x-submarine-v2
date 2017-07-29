#!/usr/bin/env python3

import os
from bottle import route, run, static_file

script_dir = os.path.dirname(os.path.realpath(__file__))
css_dir = os.path.join(script_dir, "css")
js_dir = os.path.join(script_dir, "js")


@route('/css/<filename>')
def serve_css(filename):
    return static_file(filename, root=css_dir)


@route('/js/<filename>')
def server_js(filename):
    return static_file(filename, root=js_dir)


@route('/')
def index():
    return static_file('index.html', root=script_dir)


run(host='localhost', port=8080)
