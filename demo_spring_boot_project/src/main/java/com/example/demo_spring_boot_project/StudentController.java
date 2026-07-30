package com.example.demo_spring_boot_project;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Sort;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/student")

@CrossOrigin(origins ="*")
public class StudentController {
	 
	@Autowired
	private StudentService service;// null
	
	@PostMapping
	public String insertStudent(@RequestBody Student s) {
		return service.insertStudent(s);
	}

	@GetMapping
	public List<Student> getAllStudentData(){
		return service.getAllStudentData();
	}
	
	@PostMapping("/list")  // http://localhost:8080/student/list
	public String insertListStudent(@RequestBody List<Student> student) {
		return service.insertListStudent(student);
	}
	
	@GetMapping("/id/{id}")
	public Student getById(@PathVariable int id) {
		return service.getById(id);
	}
	
	@GetMapping("/name/{name}")
	public Student findByName(@PathVariable String name) {
		return service.findByName(name);
	}
	
	
	@GetMapping("/percenatge/{percentage}")
	public List<Student> findStudentByPercentage(@PathVariable double percentage) {
		return service.findStudentByPercentage(percentage);
	}
	
	@DeleteMapping("/id/{id}")
	public String deleteStudentById(@PathVariable int id) {
		return service.deleteStudentById(id);
	}
	
	@PutMapping("/email/{id}/{email}")
	public String updateStudentEmailById(@PathVariable int id,@PathVariable String email) {
		return service.updateStudentEmailById(id, email);
	}
	
	@GetMapping("/sort/{columnName}")
	public List<Student> sortByColumn(@PathVariable String columnName){
		return service.sortByColumn(columnName);
	}
	
	@PatchMapping("/grade")
	public int updateStudentGradeByPercentage(@RequestParam double start,@RequestParam  double end,@RequestParam  String grade) {
		return service.updateStudentGradeByPercentage(start, end, grade);
	}
	
	@PatchMapping("/section")
	public int updateSectionByStudentGrade(@RequestParam String grade,@RequestParam String section) {
		return service.updateSectionByStudentGrade(grade, section);
	}
	
	@DeleteMapping("/percentage")
	public int deleteStudentByPercentage(@RequestParam double start, @RequestParam double end) {
		return service.deleteStudentByPercentage(start, end);
	}
}
