# 🧰 Basic Git Commands Guide

A quick reference for common Git commands used in everyday development.

---

## 📥 Clone a Repository

```bash
git clone <repository-url>
```

Downloads a copy of a remote repository to your local machine.

---

## 🔄 Pull Latest Changes

```bash
git pull
```

Fetches and merges changes from the remote repository into your current branch.

---

## 🌿 Create a New Branch

```bash
git branch <branch-name>
```

Creates a new branch, but doesn’t switch to it.

---

## 🔀 Switch to a Branch

```bash
git checkout <branch-name>
```

Switches to the specified branch.

> ✅ Tip: Combine creation and switch with:

```bash
git checkout -b <branch-name>
```

---

## 🌳 List All Branches

```bash
git branch
```

Shows all local branches. Use `-a` to include remote branches.

---

## 🗑️ Delete a Branch

```bash
git branch -d <branch-name>
```

Deletes a local branch (use `-D` to force delete).

---

## 📌 Check Status

```bash
git status
```

Shows the current state of the working directory and staging area.

---

## ➕ Stage Changes

```bash
git add <file-name>
```

Stages a file for commit. Use `.` to stage all changes.

---

## ✅ Commit Changes

```bash
git commit -m "Your commit message"
```

Commits staged changes with a message.

---

## 🚀 Push Changes

```bash
git push
```

Pushes your commits to the remote repository.

---

# 🐳 Useful Docker Commands Guide

A quick reference for common Docker commands for development and deployment.

---

## 📦 List Docker Images

```bash
docker images
```

Shows all images stored locally.

---

## 🚢 List Running Containers

```bash
docker ps
```

Displays active containers. Use `-a` to list all containers (including stopped).

---

## ▶️ Run a Container

```bash
docker run <image-name>
```

Runs a container from an image.

To run with port mapping:

```bash
docker run -p <host-port>:<container-port> <image-name>
```

---

## 🛑 Stop a Running Container

```bash
docker stop <container-id>
```

Stops a running container gracefully.

---

## ❌ Remove a Container

```bash
docker rm <container-id>
```

Deletes a stopped container.

---

## 🗑️ Remove an Image

```bash
docker rmi <image-id>
```

Deletes a Docker image.

---

## 🔄 Pull an Image

```bash
docker pull <image-name>
```

Downloads an image from Docker Hub.

---

## 🛠️ Build an Image From Dockerfile

```bash
docker build -t <image-name> .
```

Builds an image from a Dockerfile in the current directory.

---

## 📤 Push an Image to Registry

```bash
docker push <image-name>
```

Uploads your image to a container registry (e.g., Docker Hub).

---

## 📂 View Logs of a Container

```bash
docker logs <container-id>
```

Shows logs for a running or stopped container.
