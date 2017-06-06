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
    // ─────────────────────────────────────────────────────────────

    // Key for previous cracked lock/parameter
    z,

    // Args;
    // Response from target
    r,
    
    // Name of the current lock
    l,

    // Target loc to crack
    t = r.t.call,

    // Digits
    d = [...Array(98).keys()],
    
    // Split function to convert strings to arrays
    s = s => s[0].split(1),

    // Colors
    c = s`red1orange1yellow1lime1green1cyan1blue1purple`,

    // Parameters/passphrases for lock;
    // Storage for lock key collections
    p = {
        // EZ_21, EZ_35, EZ_40
        E: s`release1open1unlock`,
        
        // digit (EZ_35)
        d: d,
        
        // ez_prime (EZ_40)
        e: d.filter(d => d > 1 & [2, 3, 5, 7].every(p => d == p | d % p)),
        
        // l0cket
        l: s`vc2c7q1cmppiq1tvfkyq1uphlaw16hh8xw1xwz7ja1sa23uw172umy0`
    }
) {
    // Get an initial response from the target to kick things off.
    r = t(p)

    for (;
        // After any single lock has been cracked, `r` will be either:
        // - "`NLOCK_UNLOCKED`\nConnection terminated."
        // - "`NLOCK_UNLOCKED` {LOCK}\n`VLOCK_ERROR`\nDenied access by {MANUFACTURER} `N{LOCK}` lock."
        // Only the "Connection terminated" response has "nn" in it.
        !/nn/.test(r);
        
        // This happens after the loop body below.
        // Gets the appropriate key array for the current lock,
        // and brute forces the lock.
        z = (p[l[0]] || (
            /_/.test(l) ? [
                l[3] > 1 ?

                // c003_triad_x or c002_complement
                c[(c.indexOf(z) + 4 + +l[l[3] > 2 ? 11 : 1]) % 8]
                
                // color_digit
                : z.length
            ]
                
            // c00x
            : c
        
        // Cracking function - tries each value in an array for
        // the current lock/parameter, and short-circuits once
        // it finds the correct value.
        // Only the "is not the correct {PARAMETER}" message contains "th".
        )).find(v => !/th/.test((p[l] = v, r = t(p))))
    )
        // Find the last blue-colored word in the last line of output.
        // This should be the name of the next lock/parameter to crack,
        // but will throw an exception if the loc no longer exists or
        // is currently breached.
        [,l] = /.*`N(.*?)`.*$/.exec(r)
}
