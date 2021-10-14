# Simple script to generate pages for projects
from jinja2 import Template
import json

def generateProjectPages():
    with open('templates/project.html') as file:
        template = Template(file.read())
    
    contexts = json.load(open('projects.json'))

    for context in contexts:
        with open('html/projects/' + context['file'] + '.html', 'w') as output:
            rendered = template.render(context)
            output.write(rendered)
            output.close()

if __name__ == '__main__':
    generateProjectPages()