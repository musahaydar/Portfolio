# Simple script to generate pages for projects
from jinja2 import Template

def generateProjectPages():
    with open('templates/project.html') as file:
        template = Template(file.read())
    
    contexts = [
        {
            'file': 'portfolio',
            'name': 'Portfolio Website',
            'body': 'I finally updated my portfolio website to have a list of projects. Currently, it\'s a static website, with pages for each project generated using Python and Jinja.',
            'links': [
                {
                    "url":"https://github.com/musahaydar/Portfolio",
                    "text":'[0] view source code on GitHub'
                }
            ]
        } 
    ]

    for context in contexts:
        with open('html/projects/' + context['file'] + '.html', 'w') as output:
            rendered = template.render(context)
            output.write(rendered)
            output.close()

if __name__ == '__main__':
    generateProjectPages()