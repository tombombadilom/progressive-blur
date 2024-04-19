#!/usr/bin/env bash 
echo "fetch upstream"
git fetch upstream
echo "checkout main"
git checkout main
echo "merge upstream/main"
git merge upstream/main
echo "done, you may neeed to fix merge conflicts"
