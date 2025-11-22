# Front-end
This the front-end of our project, you can write HTML, CSS, React code here

Go here: https://github.com/coreybutler/nvm-windows/releases 
Download and install nvm-setup.exe
run nvm install latest


git clone https://github.com/Capstone-The-Return/Front-end.git

cd Front-end/Electo_vite

npm install

npm run dev


-- Run docker ("Cloud")
install: https://docs.docker.com/desktop/setup/install/windows-install/

docker build -f Dockerfile.localdev -t frontend-dev . 
docker run -p 5173:5173 frontend-dev
