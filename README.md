gol4
===

A game of life inspiring by John Conway's "Game of Life".

# How to play

A sequence is a 9-characters-long string, using either 0, 1, 2 or 3, which all "pixels" use as a guide throughout their life. Each digit or character is a "rule" for each pixel. The first digit is for what to do for the pixel to the top-left of the current pixel. The second digit is for the top-middle. The third is top-right. Fourth is for the right. Fifth is for bottom-right; In a clockwise motion ending in left, on the eight digit. The 9th digit can either be a 0 or 1. 0 means that the sequence will not shift by one from right to left each update. 1 means that the sequence will.

0 - Die
1 - Eat (kill its neighbor and consume its energy)
2 - Give (will split if there's no neighbor)
3 - Sleep (do nothing)

An example sequence is "202020201"

This means that for any given pixel, if there is a no neighbor to the top-left, then it will split into two and split its life points by two. Each pixel starts with 5 lifepoints. Lifepoints go down by 1 after each update.

more documentation coming soon...
