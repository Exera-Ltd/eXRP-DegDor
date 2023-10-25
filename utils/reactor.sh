
#entering right directory and building react app
cd ../frontend
echo "Building react app"
yarn install
yarn build
cd build

#move all .js to js folder
echo "Moving all js files to respective folder"
mv *.js static/js
mv js/* static/js

#moving the react static folder to the django static folder
echo "Moving react static files to django static"
rm -r ../../static/reactstatic
mv static ../../static/reactstatic

rm -r ../../static/media
mv ../../static/reactstatic/media ../../static/media

#mv index.html to django template location
echo "Moving index.html"
mv index.html ../../dashboard/templates/dashboard/index.html

#process the index.html to include django uri
echo "Editing index.html"
python3 ../../utils/deploy_react.py

#clean build dir
echo "Cleaning build..."
cd ..
rm -r build

echo "Done."
