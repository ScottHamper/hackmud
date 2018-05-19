function (
    // ═════════════════════════════════════════════════════════════
    //            Pro T1p - T1 lock cracker for ｈａｃｋｍｕｄ
    // ═════════════════════════════════════════════════════════════
    //            https://github.com/ScottHamper/hackmud
    //
    // I created this script as a challenge to see how much T1
    // cracker functionality I could pack into a single <= 500 char
    // script without needing to store anything in the database.
    //
    // Regarding performance, the script is mostly optimized for
    // each of the lock types (in terms of guesses needed):
    //
    //                 ┌──────────────┬──────────────┐
    //                 │ Theoretical  │   Pro T1p    │
    //                 ├──────┬───────┼──────┬───────┤
    //                 │ Best │ Worst │ Best │ Worst │
    //        ┌────────┼──────┼───────┼──────┼───────┤
    //        │ EZ_21  │  1   │   3   │  1   │   3   │
    //        │ EZ_35  │  1   │   12  │  2   │   13  │
    //        │ EZ_40  │  1   │   27  │  2   │   28  │
    //        │ c001   │  1   │   8   │  2   │   9   │
    //        │ c002   │  1   │   8   │  2   │   9   │
    //        │ c003   │  1   │   8   │  3   │   10  │
    //        │ l0cket │  1   │   8   │  1   │   8   │
    //        └────────┴──────┴───────┴──────┴───────┘
    //
    // NOTE: This script will only work when set as private.
    // ─────────────────────────────────────────────────────────────

    // Key for previous cracked lock/parameter
    z,

    // Response from target
    r,

    // Template string tag function that decodes whitespace into an array of "normal" strings.
    w = s => s[0].replace(/./g, c => c < ' ' | 0).replace(/.{8}/g, c => String.fromCharCode('0b' + c)).split`
`,

    // Template string tag function that decodes whitespace into an array of numbers.
    m = x => w(x).map(n => +n),

    // Colors
    // ["red", "orange", "yellow", "lime", "green", "cyan", "blue", "purple",
    //  "red", "orange", "yellow", "lime", "green", "cyan", "blue", "purple"]
    k = w` 			  	  		  	 	 		  	  
 		 				 			  	  		    	 		 			  		  			 		  	 	
 				  	 		  	 	 		 		   		 		   		 				 			 			
 		 		   		 	  	 		 		 	 		  	 	
 		  			 			  	  		  	 	 		  	 	 		 			 
 		   		 				  	 		    	 		 			 
 		   	  		 		   			 	 	 		  	 	
 			     			 	 	 			  	  			     		 		   		  	 	
 			  	  		  	 	 		  	  
 		 				 			  	  		    	 		 			  		  			 		  	 	
 				  	 		  	 	 		 		   		 		   		 				 			 			
 		 		   		 	  	 		 		 	 		  	 	
 		  			 			  	  		  	 	 		  	 	 		 			 
 		   		 				  	 		    	 		 			 
 		   	  		 		   			 	 	 		  	 	
 			     			 	 	 			  	  			     		 		   		  	 	`,

    // Parameters/passphrases for lock;
    // Storage for lock key collections
    p = {
        // EZ_21, EZ_35, EZ_40
        // ["release", "open", "unlock"]
        E: w` 			  	  		  	 	 		 		   		  	 	 		    	 			  		 		  	 	
 		 				 			     		  	 	 		 			 
 			 	 	 		 			  		 		   		 				 		   		 		 	 		`,

        // digit (EZ_35)
        // [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]
        d: m`  		    
  		   	
  		  	 
  		  		
  		 	  
  		 	 	
  		 		 
  		 			
  			   
  			  	`,

        // ez_prime (EZ_40)
        // [2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31, 37, 41, 43, 47, 53, 59, 61, 67, 71, 73, 79, 83, 89, 97]
        e: m`  		  	 
  		  		
  		 	 	
  		 			
  		   	  		   	
  		   	  		  		
  		   	  		 			
  		   	  			  	
  		  	   		  		
  		  	   			  	
  		  		  		   	
  		  		  		 			
  		 	    		   	
  		 	    		  		
  		 	    		 			
  		 	 	  		  		
  		 	 	  			  	
  		 		   		   	
  		 		   		 			
  		 			  		   	
  		 			  		  		
  		 			  			  	
  			     		  		
  			     			  	
  			  	  		 			`,

        // l0cket
        // ["vc2c7q", "cmppiq", "tvfkyq", "uphlaw", "6hh8xw", "xwz7ja", "sa23uw", "72umy0"]
        l: w` 			 		  		   		  		  	  		   		  		 			 			   	
 		   		 		 		 	 			     			     		 	  	 			   	
 			 	   			 		  		  		  		 	 		 				  	 			   	
 			 	 	 			     		 	    		 		   		    	 			 			
  		 		  		 	    		 	     			    				    			 			
 				    			 			 				 	   		 			 		 	 	  		    	
 			  		 		    	  		  	   		  		 			 	 	 			 			
  		 			  		  	  			 	 	 		 		 	 				  	  		    `
    }
) {
    // Bogus "response" that won't cause loop body regex to throw an exception
    r = 'N_'

    for (;
        // After any single lock has been cracked, `r` will be either:
        // - "`NLOCK_UNLOCKED`\nConnection terminated."
        // - "`NLOCK_UNLOCKED` {LOCK}\n`VLOCK_ERROR`\nDenied access by {MANUFACTURER} `N{LOCK}` lock."
        // Only the "Connection terminated" response has "nn" in it.
        !r[w` 		 		 	 		    	 			 	   		   		 		 	   `]`nn`;

        // This happens after the loop body below.
        // Gets the appropriate key array for the current lock,
        // and brute forces the lock.
        z = (c[4] ? p[c[0]] || [
                +c[3] ?

                // c003_triad_x or c002_complement
                k[k[w` 		 	  	 		 			  		  	   		  	 	 				    	  				 		  		 `](z) + (c[11]|4)]

                // color_digit
                : z[w` 		 		   		  	 	 		 			  		  			 			 	   		 	   `]
            ]

            // c00x
            : k

        // Cracking function - tries each value in an array for
        // the current lock/parameter, and short-circuits once
        // it finds the correct value.
        // Only the "is not the correct {PARAMETER}" message contains "th".
        ).find(v => !(p[c] = v, r = a.t.call(p))[w` 		 		 	 		    	 			 	   		   		 		 	   `]`th`)
    )
        // Find the last blue-colored word in the last line of output.
        // This should be the name of the next lock/parameter to crack,
        // but will throw an exception if the loc no longer exists or
        // is currently breached.
        [,c] = r[w` 		 		 	 		    	 			 	   		   		 		 	   `](w` 	  			   	 	    	 			   			 			  	 	 		  	 	  	  	 			   	 	 	   	  	  `)
}
