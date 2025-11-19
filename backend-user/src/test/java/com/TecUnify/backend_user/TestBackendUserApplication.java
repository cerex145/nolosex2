package com.TecUnify.backend_user;

import org.springframework.boot.SpringApplication;

public class TestBackendUserApplication {

	public static void main(String[] args) {
		SpringApplication.from(BackendUserApplication::main).with(TestcontainersConfiguration.class).run(args);
	}

}
