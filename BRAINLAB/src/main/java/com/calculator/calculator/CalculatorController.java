package com.calculator.calculator;

import java.util.Arrays;

import org.springframework.web.bind.annotation.*;

@RestController
public class CalculatorController {
	
	@GetMapping(path="/calculator/add")
	public Result compute(@RequestParam("operands") String[] values) {
		if(values == null || values.length == 0) return new Result("NaN");
		return Engine.compute(values);
	}
	

}
