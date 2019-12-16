package com.calculator.calculator;

public class Engine {
	
	public Engine() {
		
	}
	
	public static Result compute(String[] operands) {
		int total = 0;
		for(String s: operands) {
			try {
				total += Integer.parseInt(s);
			}
			catch(NumberFormatException e) {
				
				return new Result("Please enter a valid expression");
			}
			
		}
		
		return new Result(total);
	}
	
	

}
