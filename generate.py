#!/usr/bin/python3
# Simple script to generate pages for projects
from jinja2 import Template
import json
import os

def generateProjectPages():
    # load the template
    with open('templates/project.html') as file:
        template = Template(file.read())
    
    output_path = 'html/projects/'

    # create the output path if it doesn't exist
    path_exists = os.path.exists(output_path)
    if not path_exists:
        os.makedirs(output_path)

    # load contexts
    contexts = json.load(open('json/projects.json'))
    icon_ctx = json.load(open('json/icons.json'))

    # generate the pages
    for context in contexts:
        # add details needed to render icons to context
        if 'icon_names' in context:
            context['icons'] = []
            
            for icon_name in context['icon_names']:
                context['icons'].append({
                    'path': "../" + icon_ctx[icon_name]['path'],
                    'title': icon_ctx[icon_name]['title']
                })

        # render context
        with open(output_path + context['file'] + '.html', 'w') as output:
            rendered = template.render(context)
            output.write(rendered)
            output.close()

if __name__ == '__main__':
    generateProjectPages()