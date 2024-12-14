docker build --no-cache -t ce-system .

docker run -p 8080:8080 --name ce-system ce-system

# test only