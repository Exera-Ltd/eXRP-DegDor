
import re

indexhtml_path = "../../dashboard/templates/dashboard/index.html"

fh= open(indexhtml_path)
content = fh.read()
# content = content.replace(re.findall("<head>",content)[0],"<head>{% load static %}")
# content = content.replace(re.findall("<title>React App</title>",content)[0],"<title>PleoAI</title>")
# content = content.replace(re.findall("/static/",content)[0],"{% static '/reactstatic/")
# content = content.replace(re.findall(".chunk.css",content)[0],".chunk.css'%}")
# content = content.replace(re.findall(".chunk.js",content)[0],".chunk.js'%}")
# content = content.replace(re.findall("min.js",content)[0],"min.js'%}")
# content = content.replace(re.findall('"js/',content)[0],'''"{% static '/reactstatic/js/''')
# content = content.replace(re.findall("/favicon.ico",content)[0],"{% static '/static/assets/img/favicon.ico'%}")

content = content.replace("<head>","<head>{% load static %}")
content = content.replace("<title>React App</title>","<title>Kler Vision</title>")
content = content.replace("/static/","{% static '/reactstatic/")
content = content.replace(".chunk.css",".chunk.css'%}")
content = content.replace(".chunk.js",".chunk.js'%}")
content = content.replace("min.js","min.js'%}")
content = content.replace('"js/','''"{% static '/reactstatic/js/''')
content = content.replace("/favicon.ico","{% static '/static/assets/img/favicon.ico'%}")
cnt = content.split("</title>")
cnt[1] = cnt[1].replace(".js", ".js' %}").replace(".css", ".css' %}")
content = "</title>".join(cnt)

fh.close()
fh=open(indexhtml_path,'w')
fh.write(content)
