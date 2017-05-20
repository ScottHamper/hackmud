function (
    // ═════════════════════════════════════════════════════════════
    //            Pro T1p - T1 lock cracker for ｈａｃｋｍｕｄ 
    // ═════════════════════════════════════════════════════════════
    //
    // I created this script as a challenge to see how much T1
    // cracker functionality I could pack into a single <= 500 char
    // script without needing to store anything in the database.
    //
    // It currently supports all T1 locks, with nine l0cket k3ys.
    // I hear there are more k3ys out there so if you discover any
    // that I'm missing, share them with me!
    //
    // That said, there's only room for one more k3y while still
    // fitting in 500 chars. Extra room for a second k3y could be
    // created by omitting the `/nn/` test at the end of the script
    // (see the comment above it), at the detriment of the script's
    // "user experience" (but who really cares about that? pssh)
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
    //        │ c003   │  1   │   9   │  3   │   11  │
    //        │ l0cket │  1   │   n   │  1   │   n   │
    //        └────────┴──────┴───────┴──────┴───────┘
    //
    // One thing I wish I could do is use `#s.scripts.lib().shuffle`
    // on the prime numbers to mitigate timeout issues, but good
    // luck finding 26 chars for that!
    //
    // ─────────────────────────────────────────────────────────────

    // key for previous cracked lock/parameter
    z,

    // args;
    // first char in lock/parameter name;
    // the `x` in `c00x`;
    // response from target;
    // #meta
    m,

    // target loc to crack
    t = m.t.call,

    // digits
    d = [...Array(98).keys()],

    // parameters/passphrases for lock
    p = {},

    // colors
    c = 'red0orange0yellow0lime0green0cyan0blue0purple'.split(0),

    // Function to get a complement/triad.
    // Unfortunately can't use `z` in here, because it will fail
    // for the second triad parameter.
    k = i => c[c.indexOf(p['c00' + m]) + i % 8]
) {
    // l: lock/parameter name
    d.some(l => (
        // Find the last blue-colored word in the last line of output.
        // This should be the name of the next lock/parameter to crack.
        // This will throw exceptions in edge cases, but will not prevent
        // the cracker from working properly (it's just an aesthetic issue).
        // Such is the price of golf.
        [,l,m] = /.*`N((.).*?)`.*$/.exec(t(p)),
        
        // Cracking function - tries each value in an array for
        // the current lock/parameter, and short-circuits once
        // it finds the correct value.
        // Only the "is not the correct {PARAMETER}" message contains "th".
        z = (v => v.find(v => !/th/.test((p[l] = v, m = t(p)))))
        (
            // EZ_21, EZ_35, EZ_40
            m == 'E' ? ['release', 'open', 'unlock'] :
            
            // digit (EZ_35)
            m == 'd' ? d :
            
            // ez_prime (EZ_40)
            m == 'e' ? d.filter(d => d > 1 & [2, 3, 5, 7].every(p => d == p | d % p)) :
            
            // l0cket
            m == 'l' ? 'vc2c7q05c7e1r0cmppiq04jitu50uphlaw0xwz7ja0vthf6e0tvfkyq06hh8xw'.split(0) :
            
            // c00x
            !/_/.test(l) ? c :
            
            // c003_triad_x
            (m = l[3]) > 2 ? [k(3), k(5)] :
            
            // c002_complement/color_digit
            [m > 1 ? k(4) : z.length]
        ),
        
        // After any single lock has been cracked, `m` will be one of:
        // - "`NLOCK_UNLOCKED`\nConnection terminated."
        // - "`VLOCK_ERROR`\nDenied access by {MANUFACTURER} `N{LOCK}` lock."
        // - "`NLOCK_UNLOCKED` {LOCK}\n`VLOCK_ERROR`\nDenied access by {MANUFACTURER} `N{LOCK}` lock."
        // Only the "Connection terminated" response has "nn" in it.
        // You could omit this entirely if you don't mind the script always finishing with an exception.
        // (You would also have to make some other small tweaks due to this being in `d.some`)
        /nn/.test(m)
    ))
    
    // Uncomment below if you want to see what all the cracked parameters are. 500 chars on the dot!
    //return p
}
