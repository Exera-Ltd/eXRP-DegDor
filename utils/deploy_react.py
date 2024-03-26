
import re

indexhtml_path = "../../dashboard/templates/dashboard/index.html"

fh= open(indexhtml_path)
content = fh.read()
content = content.replace("<head>","<head>{% load static %}")
content = content.replace("<title>React App</title>","<title>Alfar Global</title>")
content = content.replace("/static/","{% static '/reactstatic/")
content = content.replace(".chunk.css",".chunk.css'%}")
content = content.replace(".chunk.js",".chunk.js'%}")
content = content.replace("min.js","min.js'%}")
content = content.replace('"js/','''"{% static '/reactstatic/js/''')
content = content.replace("/favicon.ico","{% static 'img/favicon.ico'%}")
cnt = content.split("</title>")
cnt[1] = cnt[1].replace(".js", ".js' %}").replace(".css", ".css' %}")
content = "</title>".join(cnt)

fh.close()
fh=open(indexhtml_path,'w')
fh.write(content)
