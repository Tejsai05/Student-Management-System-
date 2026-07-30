package com.example.demo_spring_boot_project;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Component;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;

@Service
public class StudentService {

	// actual Code

	@Autowired
	private StudentJpaRepository studentjpa;

	public String insertStudent(Student s) {

		studentjpa.save(s);// actual code

		return "Student data inserted";
	}

	public List<Student> getAllStudentData() {
		return studentjpa.findAll();
	}

	public String insertListStudent(List<Student> student) {

		studentjpa.saveAll(student);

		return "Student data inserted";

	}

	public Student getById(int id) {

		Optional<Student> option = studentjpa.findById(id);// primary key
		// Optional --> null check
		if (option.isPresent()) {

			return option.get();
		}

		return null;
	}

	public Student findByName(String name) {
		return studentjpa.findByName(name);
	}

	public List<Student> findStudentByPercentage(double percentage) {
		return studentjpa.findByPercentage(percentage);
	}

	public String deleteStudentById(int id) {

		boolean isPresent = studentjpa.existsById(id);

		if (isPresent) {

			studentjpa.deleteById(id);
			return "Student Data deleted ";
		} else {
			return "Student Data Not present";
		}

	}
	
	public String updateStudentEmailById(int id, String email) {

		Student student = getById(id);

		student.setEmail(email);

		studentjpa.save(student);

		return "Data Updated";
	}
	
	public List<Student> sortByColumn(String columnName){
		
		return studentjpa.findAll(Sort.by(columnName).descending());
	}
	
	public int updateStudentGradeByPercentage(double start,double end,String grade) {
		
		return studentjpa.updateStudentGradeByPercentage(start, end, grade);
	}
	
	public int updateSectionByStudentGrade(String grade,String section) {
		
		return studentjpa.updateSectionByStudentGrade(grade, section);
	}

	public int deleteStudentByPercentage(double start, double end) {
		return studentjpa.deleteStudentByPercentage(start, end);
	}
}
