#!/usr/bin/python3
# Simple script to generate pages for projects
from jinja2 import Template
import json
import os

def generateProjectPages():
    # load the template
    with open('templates/project.html') as file:
        template = Template(file.read())
    
    contexts = json.load(open('projects.json'))
    output_path = 'html/projects/'

    # create the output path if it doesn't exist
    path_exists = os.path.exists(output_path)
    if not path_exists:
        os.makedirs(output_path)

    # generate the pages
    for context in contexts:
        with open(output_path + context['file'] + '.html', 'w') as output:
            rendered = template.render(context)
            output.write(rendered)
            output.close()

if __name__ == '__main__':
    generateProjectPages()