
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
