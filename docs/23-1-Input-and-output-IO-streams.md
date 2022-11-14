---
title: 23.1 - 输入输出流
alias: 23.1 - 输入输出流
origin: /input-and-output-io-streams/
origin_title: "23.1 — Input and output (I/O) streams"
time: 2022-10-15
type: translation
tags:
- io
---

??? note "关键点速记"

输入输出并没有被定义为C++语言的核心功能，它是通过C++的标准库提供的（因此位于std命名空间中）。在之前的课程中，我们在代码中包含了`iostream`库的头文件并使用了`cin`和`cout`对象进行简单的输入输出。在本节课中，我们会进一步研究其细节。

## `iostream` 库

当我们包含 `iostream` 头文件后，你就可以访问提供输入输出功能的全部类了（包括一个称为`iostream`的类）。所有非文件IO的类的继承图可以在[这里](https://en.cppreference.com/w/cpp/io) 找到。

关于这个层次结构，您可能注意到的第一件事是它使用了多重继承(这是我们多次提醒你要避免的事情)。但是，`iostream` 库经过了广泛的设计和测试，以避免任何典型的多重继承问题，因此你可以放心大胆地使用它。

## 流（Streams）

你可能注意到的第二件事是“流(stream)”这个词被使用得非常频繁。在最基本的情况下，C++中的I/O是通过流实现的。抽象地说，一个**流**只是一个可以按顺序访问的字节序列。随着时间的推移，流可能产生或消耗无限数量的数据。

Typically we deal with two different types of streams. **Input streams** are used to hold input from a data producer, such as a keyboard, a file, or a network. For example, the user may press a key on the keyboard while the program is currently not expecting any input. Rather than ignore the users keypress, the data is put into an input stream, where it will wait until the program is ready for it.

Conversely, **output streams** are used to hold output for a particular data consumer, such as a monitor, a file, or a printer. When writing data to an output device, the device may not be ready to accept that data yet -- for example, the printer may still be warming up when the program writes data to its output stream. The data will sit in the output stream until the printer begins consuming it.

Some devices, such as files and networks, are capable of being both input and output sources.

The nice thing about streams is the programmer only has to learn how to interact with the streams in order to read and write data to many different kinds of devices. The details about how the stream interfaces with the actual devices they are hooked up to is left up to the environment or operating system.

**Input/output in C++**

Although the ios class is generally derived from ios_base, ios is typically the most base class you will be working directly with. The ios class defines a bunch of stuff that is common to both input and output streams. We’ll deal with this stuff in a future lesson.

The **istream** class is the primary class used when dealing with input streams. With input streams, the **extraction operator (>>)** is used to remove values from the stream. This makes sense: when the user presses a key on the keyboard, the key code is placed in an input stream. Your program then extracts the value from the stream so it can be used.

The **ostream** class is the primary class used when dealing with output streams. With output streams, the **insertion operator (<<)** is used to put values in the stream. This also makes sense: you insert your values into the stream, and the data consumer (e.g. monitor) uses them.

The **iostream** class can handle both input and output, allowing bidirectional I/O.

**Standard streams in C++**

A **standard stream** is a pre-connected stream provided to a computer program by its environment. C++ comes with four predefined standard stream objects that have already been set up for your use. The first three, you have seen before:

1.  **cin** -- an istream object tied to the standard input (typically the keyboard)
2.  **cout** -- an ostream object tied to the standard output (typically the monitor)
3.  **cerr** -- an ostream object tied to the standard error (typically the monitor), providing unbuffered output
4.  **clog** -- an ostream object tied to the standard error (typically the monitor), providing buffered output

Unbuffered output is typically handled immediately, whereas buffered output is typically stored and written out as a block. Because clog isn’t used very often, it is often omitted from the list of standard streams.

In the next lesson, we’ll take a look at some more I/O related functionality in more detail.

[

](https://www.learncpp.com/cpp-tutorial/input-with-istream/)