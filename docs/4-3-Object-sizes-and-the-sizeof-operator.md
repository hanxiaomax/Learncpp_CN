---
title: 4.3 - 对象的大小和 sizeof 操作符
alias: 4.3 - 对象的大小和 sizeof 操作符
origin: /object-sizes-and-the-sizeof-operator/
origin_title: "4.3 — Object sizes and the sizeof operator"
time: 2022-1-2
type: translation
tags:
- sizeof
---

Object sizes

As you learned in the lesson [4.1 -- Introduction to fundamental data types](https://www.learncpp.com/cpp-tutorial/introduction-to-fundamental-data-types/), memory on modern machines is typically organized into byte-sized units, with each byte of memory having a unique address. Up to this point, it has been useful to think of memory as a bunch of cubbyholes or mailboxes where we can put and retrieve information, and variables as names for accessing those cubbyholes or mailboxes.

However, this analogy is not quite correct in one regard -- most objects actually take up more than 1 byte of memory. A single object may use 2, 4, 8, or even more consecutive memory addresses. The amount of memory that an object uses is based on its data type.

Because we typically access memory through variable names (and not directly via memory addresses), the compiler is able to hide the details of how many bytes a given object uses from us. When we access some variable _x_, the compiler knows how many bytes of data to retrieve (based on the type of variable _x_), and can handle that task for us.

Even so, there are several reasons it is useful to know how much memory an object uses.

First, the more memory an object uses, the more information it can hold.

A single bit can hold 2 possible values, a 0, or a 1:

| bit 0      | 
| ----- | 
| 0    | 
| 1      | 


| bit 0      | bit 1
| ----- | -----|
| 0    | 0
| 1      | 1
|1      | 0
|1      |1 


| bit 0      | bit 1 | bit 2 
| ----- | -----|-----|
| 0    | 0 |  0 
| 0    | 0 |  1
| 0    | 1 |  0
| 0    | 1 |  1
|1      | 0 |  0 
|1      | 0 |  1
|1      | 1 |  0 
|1      |1   |  1