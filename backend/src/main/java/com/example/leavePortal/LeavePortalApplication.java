package com.example.leavePortal;

import com.corundumstudio.socketio.SocketIOServer;
import com.example.leavePortal.model.Employee;
import com.example.leavePortal.model.Project;
import com.example.leavePortal.model.ProjectEmployeeRole;
import com.example.leavePortal.model.TotalLeave;
import com.example.leavePortal.repo.EmployeeRepo;
import com.example.leavePortal.repo.ProjectEmployeeRoleRepo;
import com.example.leavePortal.repo.ProjectRepo;
import com.example.leavePortal.repo.TotalLeaveRepo;
import lombok.AllArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.scheduling.annotation.EnableAsync;
import java.util.List;


@SpringBootApplication
@EnableAsync
@AllArgsConstructor
public class LeavePortalApplication implements CommandLineRunner {

	private final EmployeeRepo employeeRepo;
	private final TotalLeaveRepo totalLeaveRepo;
	private final ProjectRepo projectRepo;
	private final ProjectEmployeeRoleRepo projectEmployeeRoleRepo;

	public static void main(String[] args) {
		SpringApplication.run(LeavePortalApplication.class, args);
	}

	@Override
	public void run(String... args) throws Exception {
		createDefaultAdminIfMissing();
	}

	private void createDefaultAdminIfMissing() {
		List<Employee> adminAccounts = employeeRepo.findByRole(Employee.Role.ADMIN);
		if (adminAccounts.isEmpty()) {
			try {
				Employee admin = createEmployee("admin", "a@123", Employee.Role.ADMIN, "admin", "divyansh27032002@gmail.com", "9876543210");
				Employee rohan = createEmployee("rohan", "r@123", Employee.Role.EMPLOYEE, "Rohan Singh", "rohhhhhan1123@gmail.com", "9776543210");
				Employee sohan = createEmployee("sohan", "s@123", Employee.Role.MANAGER, "Sohan", "soooohan123@gmail.com", "9676543210");
				Employee mohan = createEmployee("mohan", "m@123", Employee.Role.MANAGER, "Mohan Gupta", "devanshsharan.gupta@beehyv.com", "5576543210");
				Employee ram = createEmployee("ram", "r@123", Employee.Role.MANAGER, "Ram Radhe", "raaaaam123@gmail.com", "9076543210");
				Employee shyam = createEmployee("shyam", "s@123", Employee.Role.MANAGER, "Shyam", "devanshsharangupta@gmail.com", "4876543210");

				Project p1 = createProject("P1", "This is the p1 project");
				Project p2 = createProject("P2", "This is the p2 project");
				Project p3 = createProject("P3", "This is the p3 project");

				assignRoleToProject(rohan, p1, ProjectEmployeeRole.Role.EMPLOYEE);
				assignRoleToProject(sohan, p1, ProjectEmployeeRole.Role.MANAGER);
				assignRoleToProject(mohan, p1, ProjectEmployeeRole.Role.MANAGER);
				assignRoleToProject(sohan, p2, ProjectEmployeeRole.Role.EMPLOYEE);
				assignRoleToProject(ram, p2, ProjectEmployeeRole.Role.MANAGER);
				assignRoleToProject(ram, p3, ProjectEmployeeRole.Role.EMPLOYEE);
				assignRoleToProject(shyam, p3, ProjectEmployeeRole.Role.MANAGER);

			} catch (Exception e) {
				e.printStackTrace();
			}
		}
	}

	private Employee createEmployee(String username, String password, Employee.Role role, String name, String email, String number) {
		Employee employee = new Employee();
		employee.setUsername(username);
		employee.setPassword(new BCryptPasswordEncoder().encode(password));
		employee.setRole(role);
		employee.setName(name);
		employee.setEmail(email);
		employee.setNumber(number);
		employeeRepo.save(employee);

		TotalLeave totalLeave = new TotalLeave();
		totalLeave.setEmployee(employee);
		totalLeaveRepo.save(totalLeave);

		return employee;
	}

	private Project createProject(String name, String description) {
		Project project = new Project();
		project.setName(name);
		project.setDescription(description);
		projectRepo.save(project);
		return project;
	}

	private void assignRoleToProject(Employee employee, Project project, ProjectEmployeeRole.Role role) {
		ProjectEmployeeRole projectEmployeeRole = new ProjectEmployeeRole(employee, project, role);
		projectEmployeeRoleRepo.save(projectEmployeeRole);
	}
}