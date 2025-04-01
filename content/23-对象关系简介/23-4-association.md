---
title: 23.4 - 关联关系
alias: 23.4 - 关联关系
origin: /association/
origin_title: "16.4 — Association"
time: 2022-5-31
type: translation
tags:
- object
- association
---


> [!note] "Key Takeaway"

在前面的两节课中，我们介绍了两种对象组合关系——组合和继承。对象组合用于通过一个或多个简单对象构建复杂对象。

在这节课中，我们将看看两个本来不相关的对象之间的一种较弱类型的关系，称为关联。与对象组合关系不同，在关联中，没有隐含的整体/部分关系。

## 关联

形成关联关系时，对象和对象之间需要满足下面条件：

- 关联的对象(成员)在其他方面与对象(类)无关；
- 关联的对象(成员)可以同时属于多个对象(类)；
- 关联对象(成员)的存在性不由对象(类)管理；
- 关联的对象(成员)可能知道也可能不知道对象(类)的存在。

  
在组合或聚合中，部分是整个对象的一部分，而在关联中，关联对象在其他方面与对象无关。就像聚合一样，关联的对象可以同时属于多个对象，并且不受这些对象的管理。然而，与聚合(聚合的关系总是单向的)不同，在关联中，关系可能是单向的或双向的(其中两个对象彼此意识到对方)。

医生和病人之间的关系就是一个很好的例子。医生显然与他的病人有一种关系，但从概念上讲，这不是一个部分/整体(对象组成)关系。一个医生一天可以看很多病人，一个病人可以看很多医生(也许他们想要第二个意见，或者他们正在看不同类型的医生)。这两个物体的寿命都与对方无关。

我们可以说关联建模为“使用一个”关系。医生“使用”病人(以赚取收入)。病人“使用”医生(为了他们需要的任何健康目的)。

## 实现关联关系

因为关联是一种比较宽泛的关系类型，它们可以以许多不同的方式实现。然而，大多数情况下，关联是使用指针实现的，对象指向关联对象。

在本例中，我们将实现一个双向的医生/病人关系，因为医生知道谁是他们的病人，反之亦然。

```cpp
#include <functional> // reference_wrapper
#include <iostream>
#include <string>
#include <vector>

// Since Doctor and Patient have a circular dependency, we're going to forward declare Patient
class Patient;

class Doctor
{
private:
	std::string m_name{};
	std::vector<std::reference_wrapper<const Patient>> m_patient{};

public:
	Doctor(const std::string& name) :
		m_name{ name }
	{
	}

	void addPatient(Patient& patient);

	// We'll implement this function below Patient since we need Patient to be defined at that point
	friend std::ostream& operator<<(std::ostream& out, const Doctor& doctor);

	const std::string& getName() const { return m_name; }
};

class Patient
{
private:
	std::string m_name{};
	std::vector<std::reference_wrapper<const Doctor>> m_doctor{}; // so that we can use it here

	// We're going to make addDoctor private because we don't want the public to use it.
	// They should use Doctor::addPatient() instead, which is publicly exposed
	void addDoctor(const Doctor& doctor)
	{
		m_doctor.push_back(doctor);
	}

public:
	Patient(const std::string& name)
		: m_name{ name }
	{
	}

	// We'll implement this function below to parallel operator<<(std::ostream&, const Doctor&)
	friend std::ostream& operator<<(std::ostream& out, const Patient& patient);

	const std::string& getName() const { return m_name; }

	// We'll friend Doctor::addPatient() so it can access the private function Patient::addDoctor()
	friend void Doctor::addPatient(Patient& patient);
};

void Doctor::addPatient(Patient& patient)
{
	// Our doctor will add this patient
	m_patient.push_back(patient);

	// and the patient will also add this doctor
	patient.addDoctor(*this);
}

std::ostream& operator<<(std::ostream& out, const Doctor& doctor)
{
	if (doctor.m_patient.empty())
	{
		out << doctor.m_name << " has no patients right now";
		return out;
	}

	out << doctor.m_name << " is seeing patients: ";
	for (const auto& patient : doctor.m_patient)
		out << patient.get().getName() << ' ';

	return out;
}

std::ostream& operator<<(std::ostream& out, const Patient& patient)
{
	if (patient.m_doctor.empty())
	{
		out << patient.getName() << " has no doctors right now";
		return out;
	}

	out << patient.m_name << " is seeing doctors: ";
	for (const auto& doctor : patient.m_doctor)
		out << doctor.get().getName() << ' ';

	return out;
}

int main()
{
	// Create a Patient outside the scope of the Doctor
	Patient dave{ "Dave" };
	Patient frank{ "Frank" };
	Patient betsy{ "Betsy" };

	Doctor james{ "James" };
	Doctor scott{ "Scott" };

	james.addPatient(dave);

	scott.addPatient(dave);
	scott.addPatient(betsy);

	std::cout << james << '\n';
	std::cout << scott << '\n';
	std::cout << dave << '\n';
	std::cout << frank << '\n';
	std::cout << betsy << '\n';

	return 0;
}
```

程序运行结果：

```
James is seeing patients: Dave
Scott is seeing patients: Dave Betsy
Dave is seeing doctors: James Scott
Frank has no doctors right now
Betsy is seeing doctors: Scott
```

一般来说，如果可以使用单向关联，则应该避免使用双向关联，因为它们增加了复杂性，而且很难在不出错。

## 反身关联

有时对象可能与相同类型的其他对象有关系，这被称为[[reflexive association|反身关联]]。反身关联的一个很好的例子是大学课程和它的先修课程(也是大学课程)之间的关系。

考虑一个简化的情况，其中一个课程只能有一个先修课程。我们可以这样做:


```cpp
#include <string>
class Course
{
private:
    std::string m_name;
    const Course* m_prerequisite;

public:
    Course(const std::string& name, const Course* prerequisite = nullptr):
        m_name{ name }, m_prerequisite{ prerequisite }
    {
    }

};
```



这可能会导致一系列的关联(一门课程有一个先决条件，另一门课程也有一个先决条件，等等……)

## 关联可以是间接的

在前面的所有例子中，我们都使用指针或引用直接将对象连接在一起。然而在关联中，并不一定要这样做。任何能够建立两个对象之间关系的数据都可以。在下面的例子中，我们展示了`Driver`类如何在不实际包含`Car`指针或引用成员的情况下与`Car`形成单向关联关系：

```cpp
#include <iostream>
#include <string>

class Car
{
private:
	std::string m_name;
	int m_id;

public:
	Car(const std::string& name, int id)
		: m_name{ name }, m_id{ id }
	{
	}

	const std::string& getName() const { return m_name; }
	int getId() const { return m_id; }
};

// Our CarLot is essentially just a static array of Cars and a lookup function to retrieve them.
// Because it's static, we don't need to allocate an object of type CarLot to use it
class CarLot
{
private:
	static Car s_carLot[4];

public:
	CarLot() = delete; // Ensure we don't try to create a CarLot

	static Car* getCar(int id)
	{
		for (int count{ 0 }; count < 4; ++count)
		{
			if (s_carLot[count].getId() == id)
			{
				return &(s_carLot[count]);
			}
		}

		return nullptr;
	}
};

Car CarLot::s_carLot[4]{ { "Prius", 4 }, { "Corolla", 17 }, { "Accord", 84 }, { "Matrix", 62 } };

class Driver
{
private:
	std::string m_name;
	int m_carId; // we're associated with the Car by ID rather than pointer

public:
	Driver(const std::string& name, int carId)
		: m_name{ name }, m_carId{ carId }
	{
	}

	const std::string& getName() const { return m_name; }
	int getCarId() const { return m_carId; }
};

int main()
{
	Driver d{ "Franz", 17 }; // Franz is driving the car with ID 17

	Car* car{ CarLot::getCar(d.getCarId()) }; // Get that car from the car lot

	if (car)
		std::cout << d.getName() << " is driving a " << car->getName() << '\n';
	else
		std::cout << d.getName() << " couldn't find his car\n";

	return 0;
}
```


在上面的例子中，`CarLot` 持有`car` 。而 `Driver` 作为本身需要`car`的对象，却并没有指向`Car`的指针——但是它有车的ID，它可以通过该ID在需要时从 `CarLot` 中获取`car`。

在这个特定的示例中，这样做有点愚蠢，因为从`CarLot`中获取`Car`需要低效的查找(之间直接使用指针要快得多)。然而，通过唯一ID而不是指针引用东西有一些优点。例如，你可以引用当前不在内存中的内容(它们可能在文件中，或者在数据库中，并且可以按需加载)。此外，指针可能占用4或8个字节——如果空间非常有限，且惟一对象的数量相当低，那么通过8位或16位整数引用它们可以节省大量内存。

## 组合 vs 聚合  vs 关联

下面是一个汇总表，可以帮助你记住组合、聚合和关联之间的区别:

|属性|	组合|	聚合|	关联|
|:---:|:---:|:---:|:---:|
|关系类型	|整体-部分|整体-部分|本不相关
|成员是否可以属于不同的整体对象	|No|	Yes|	Yes
|成员的存在性是否由整体管理|	Yes	|No	|No
|方向	|单向	|单向	|单向或双向
|关系动词|Part-of	|Has-a	|Uses-a
