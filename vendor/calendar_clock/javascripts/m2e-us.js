var MARS_TO_EARTH_DAYS = 1.027491251;
var EPOCH_OFFSET = 587744.77817;
var ROUND_UP_SECOND = 1/86400;
var eDaysTilMonth = new Array( -1, -1,
 30, 58, 89, 119, 150, 180, 211, 242, 272, 303, 333);
var eDaysInMonth = new Array( 0, 31, 29, 31, 30, 31, 30, 31, 31,
 30, 31, 30, 31);

function getEarthDaysFromForm()
{
    var year = parseInt(document.calc.eYear.value, 10);
    var month= parseInt(document.calc.eMonth.value,10);
    var day  = parseInt(document.calc.eDay.value,  10);

    var daysSince = day + eDaysTilMonth[month]
        + 365 * year
        + Math.floor(year / 4)
        - Math.floor(year / 100)
        + Math.floor(year / 400)

    if((month < 3)
      && isEarthLeapYear(year))
        daysSince -= 1;

    var hour = parseInt(document.calc.eHour.value, 10)/24
    var min  = parseInt(document.calc.eMin.value, 10)/1440
    var sec  = parseInt(document.calc.eSec.value, 10)/86400;

    if(!isNaN(hour)) daysSince += hour;
    if(!isNaN(min))  daysSince += min;
    if(!isNaN(sec))  daysSince += sec;

    return daysSince;
}


function getMarsSolsFromForm()
{
    var year = parseInt(document.calc.mYear.value, 10);
    var month= parseInt(document.calc.mMonth.value,10);
    var day  = parseInt(document.calc.mDay.value,  10);
    var TestData = 3;

    var solsSince = day + ((month-1) * 28) - Math.floor((month-1)/6)
        + 668 * year
          + Math.floor(year / 2)
          + Math.floor((year-1) / 10)
          - Math.floor((year-1) / 100)
          + Math.floor((year-1) / 1000);

    var hour = parseInt(document.calc.mHour.value, 10)/24
    var min  = parseInt(document.calc.mMin.value, 10)/1440
    var sec  = parseInt(document.calc.mSec.value, 10)/86400;

    if(!isNaN(hour)) solsSince += hour;
    if(!isNaN(min))  solsSince += min;
    if(!isNaN(sec))  solsSince += sec;

    return solsSince;
}

function setMarsDateFromSols(solsSince)
{
    // get the fractional part, to do the time later
    partialSol = solsSince - Math.floor(solsSince);

    // Convert sols to Martian date:
    var s = solsSince;
 
    var sD  = Math.floor(s/334296);
    var doD = Math.floor(s-(sD*334296));
 
    var sC = 0;
    var doC = doD;
    if(doD != 0) sC = Math.floor((doD-1)/66859);
    if(sC != 0) doC -= (sC*66859+1);

    var sX = 0;
    var doX = doC;
    if(sC != 0)  // century that does not begin with leap day
    {
      sX = Math.floor((doC+1)/6686);
      if(sX != 0) doX -= (sX*6686-1);
    }
    else
    {
      sX = Math.floor(doC/6686);
      if(sX != 0) doX -= (sX*6686);
    }

    var sII = 0;
    var doII = doX;
    if(sC != 0 && sX == 0)  // decade that does not begin with leap day
    {
      sII = Math.floor(doX/1337);
      if(sII != 0) doII -= (sII*1337);
    }
    else  // 1338, 1337, 1337, 1337 ...
    {
      if(doX != 0) sII = Math.floor((doX-1)/1337);
      if(sII != 0) doII -= (sII*1337+1);
    }

    var sI = 0;
    var doI= doII;
    if(sII==0 && (sX != 0 || (sX == 0 && sC == 0)))
    {
      sI = Math.floor(doII/669);
      if(sI != 0) doI -= 669;
    }
    else  // 668, 669
    {
      sI = Math.floor((doII+1)/669);
      if(sI != 0) doI -= 668;
    }

    marsYear = 500*sD + 100*sC + 10*sX + 2*sII + sI;


    // get the date from the day of the year:

    var tmpSeason = getMartianSeasonFromSol(doI);            // 0-3
    var tmpSolOfSeason = doI-167*tmpSeason;                  // 0-167
    var tmpMonthOfSeason = Math.floor(tmpSolOfSeason/28);    // 0-5

    var marsMonth = tmpMonthOfSeason + 6*tmpSeason + 1;      // 1-24

    var marsDay   = doI - ((marsMonth-1)*28 - tmpSeason) + 1;  // 1-28

    var SolNomen = parseInt(document.calc.InSolNomen.value, 10);

    if (SolNomen == 1)
    {
    //Darian Sols of the Week
    if ((marsDay - 1) % 7 + 1 == 1)
    	nSolName = "Sol Solis";
    if ((marsDay - 1) % 7 + 1 == 2)
    	nSolName = "Sol Lunae";
    if ((marsDay - 1) % 7 + 1 == 3)
    	nSolName = "Sol Martis";
    if ((marsDay - 1) % 7 + 1 == 4)
    	nSolName = "Sol Mercurii";
    if ((marsDay - 1) % 7 + 1 == 5)
    	nSolName = "Sol Jovis";
    if ((marsDay - 1) % 7 + 1 == 6)
    	nSolName = "Sol Veneris";
    if ((marsDay - 1) % 7 + 1 == 7)
    	nSolName = "Sol Saturni";
    }

    else if (SolNomen == 2)
    {
    //Darian Defrost Sols of the Week
    if ((marsDay - 1) % 7 + 1 == 1)
    	nSolName = "Axatisol";
    if ((marsDay - 1) % 7 + 1 == 2)
    	nSolName = "Benasol";
    if ((marsDay - 1) % 7 + 1 == 3)
    	nSolName = "Ciposol";
    if ((marsDay - 1) % 7 + 1 == 4)
    	nSolName = "Domesol";
    if ((marsDay - 1) % 7 + 1 == 5)
    	nSolName = "Erjasol";
    if ((marsDay - 1) % 7 + 1 == 6)
    	nSolName = "Fulisol";
    if ((marsDay - 1) % 7 + 1 == 7)
    	nSolName = "Gavisol";
    }

    else if (SolNomen == 3)
    {

    //Utopian Sols of the Week
    if ((marsDay - 1) % 7 + 1 == 1)
    	nSolName = "Sunsol";
    if ((marsDay - 1) % 7 + 1 == 2)
    	nSolName = "Phobosol";
    if ((marsDay - 1) % 7 + 1 == 3)
    	nSolName = "Deimosol";
    if ((marsDay - 1) % 7 + 1 == 4)
    	nSolName = "Terrasol";
    if ((marsDay - 1) % 7 + 1 == 5)
    	nSolName = "Venusol";
    if ((marsDay - 1) % 7 + 1 == 6)
    	nSolName = "Mercurisol";
    if ((marsDay - 1) % 7 + 1 == 7)
    	nSolName = "Jovisol";
    }

    // Put the result up:

    document.calc.mYear.value = threeDigit(marsYear);
    document.calc.mMonth.value = marsMonth;
    document.calc.mDay.value = twoDigit(marsDay);
    document.calc.mJulianDay.value = (Math.floor(solsSince*100000)/100000);
    document.calc.mNumDay.value = threeDigit(doI);
    document.calc.mSolName.value = nSolName;

    var tmpHour = partialSol*24;
    var tmpMin  = (tmpHour - Math.floor(tmpHour))*60;
    var tmpSec  = (tmpMin - Math.floor(tmpMin))*60;
    document.calc.mHour.value = twoDigit(Math.floor(tmpHour));
    document.calc.mMin.value  = twoDigit(tmpMin);
    document.calc.mSec.value  = twoDigit(tmpSec);

    if (doI == 0)
	ThisSol = 'Vernal Equinox (nominal date).';
    if (doI == 1)
	ThisSol = '';
    if (doI == 2)
	ThisSol = '';
    if (doI == 3)
	ThisSol = 'On this sol in 136: Robert G. Aitken was born, developed the first complete Martian calendar.';
    if (doI == 4)
	ThisSol = 'On this sol in 188: Mars 1962A (Sputnik 29) was launched, but failed to leave Earth orbit.';
    if (doI == 5)
	ThisSol = 'On this sol in 170: Philip K. Dick was born, author of "Martian Time-Slip."';
    if (doI == 6)
	ThisSol = 'On this sol in 162: Edgar Rice Burroughs� "The Warlord of Mars" began serialization in "All-Story" (date approximate).';
    if (doI == 7)
	ThisSol = '';
    if (doI == 8)
	ThisSol = 'On this sol in 194: Mars 4 failed to enter Mars orbit, passed Mars.';
    if (doI == 9)
	ThisSol = '';
    if (doI == 10)
	ThisSol = 'On this sol in 194: Mars 5 entered Mars orbit.';
    if (doI == 11)
	ThisSol = '';
    if (doI == 12)
	ThisSol = 'On this sol in 188: Mars 1 was launched. Robert A. Heinlein�s "Podkayne of Mars" began serialization in "If" (date approximate).';
    if (doI == 13)
	ThisSol = '';
    if (doI == 14)
	ThisSol = 'On this sol in 184: The motion picture "Devil Girl From Mars" was released in the USA.';
    if (doI == 15)
	ThisSol = 'On this sol in 188: Mars 1962B (Sputnik 31) was launched, but failed to leave Earth orbit.';
    if (doI == 16)
	ThisSol = 'On this sol in 208: A meteorite, designated Dhofar 378, was discovered near Dhofar, Oman. The meteorite was later identified as having originated on Mars.';
    if (doI == 17)
	ThisSol = '';
    if (doI == 18)
	ThisSol = 'On this sol in 019: Two patches on the lower part of the disk of Mars were described by a Neapolitan Jesuit named Father Bartoli.';
    if (doI == 19)
	ThisSol = '';
    if (doI == 20)
	ThisSol = '';
    if (doI == 21)
	ThisSol = '';
    if (doI == 22)
	ThisSol = '';
    if (doI == 23)
	ThisSol = 'On this sol in 206: US President Bill Clinton abandoned George Bush�s goal of a manned landing on Mars. His National Science and Technology Council�s statement of National Space Policy only mentioned "a sustained program to support a robotic presence on the surface of Mars by year 2000 for the purposes of scientific research, exploration and technology development."';
    if (doI == 24)
	ThisSol = 'On this sol in 161: Edgar Rice Burroughs� "Under the Moons of Mars" began serialization in "All-Story," later was published as a novel under the title "A Princess of Mars" (date approximate).';
    if (doI == 25)
	ThisSol = '';
    if (doI == 26)
	ThisSol = '';
    if (doI == 27)
	ThisSol = '';
    if (doI == 28)
	ThisSol = 'On this sol in 207: "The Founding Convention of the Mars Society" opened in Boulder, Colorado.';
    if (doI == 29)
	ThisSol = '';
    if (doI == 30)
	ThisSol = 'On this sol in 207: "The Founding Declaration of the Mars Society" was adopted unanimously in Boulder, Colorado.';
    if (doI == 31)
	ThisSol = '';
    if (doI == 32)
	ThisSol = '';
    if (doI == 33)
	ThisSol = '';
    if (doI == 34)
	ThisSol = '';
    if (doI == 35)
	ThisSol = 'On this sol in 194: Mars 7 passed Mars. Lander missed Mars.';
    if (doI == 36)
	ThisSol = '';
    if (doI == 37)
	ThisSol = 'On this sol in 202: Contact with Phobos 2 was lost after 58 sols in Mars orbit.';
    if (doI == 38)
	ThisSol = 'On this sol in 194: Mars 6 passed Mars. Contact with the lander was lost before landing.';
    if (doI == 39)
	ThisSol = '';
    if (doI == 40)
	ThisSol = '';
    if (doI == 41)
	ThisSol = 'On this sol in 164: Edgar Rice Burroughs� "A Princess of Mars" was published by McClurg.';
    if (doI == 42)
	ThisSol = '';
    if (doI == 43)
	ThisSol = '';
    if (doI == 44)
	ThisSol = '';
    if (doI == 45)
	ThisSol = '';
    if (doI == 46)
	ThisSol = 'On this sol in 145: Giovanni Schiaparelli recorded the first instance of gemination. "Great was my astonishment on January 19, when, on examining the Jamuna... I saw instead of its usual appearance two straight and equal parallel lines running between the Niliacus Lacus and Aurorae Sinus. At first I believed this to be the deception of a tired eye, or perhaps the effect of some kind of strabismus, but I soon convinced myself that the phenomenon was real."';
    if (doI == 47)
	ThisSol = '';
    if (doI == 48)
	ThisSol = '';
    if (doI == 49)
	ThisSol = '';
    if (doI == 50)
	ThisSol = 'On this sol in 191: NASA terminated the contract to procure additional Saturn Vs, ending production with Saturn 515, and abandoning the heavy-lift launch capability required to launch piloted Mars missions.';
    if (doI == 51)
	ThisSol = '';
    if (doI == 52)
	ThisSol = 'On this sol in 196: A meteorite, designated ALHA 77005, was discovered in the Allan Hills, Antarctica. In the 200s, the meteorite was identified as having originated on Mars.';
    if (doI == 53)
	ThisSol = '';
    if (doI == 54)
	ThisSol = 'On this sol in 161: Leigh Brackett was born, author of the Eric John Stark series of Martian stories.';
    if (doI == 55)
	ThisSol = '';
    if (doI == 56)
	ThisSol = '';
    if (doI == 57)
	ThisSol = '';
    if (doI == 58)
	ThisSol = '';
    if (doI == 59)
	ThisSol = 'On this sol in 171: The motion picture "Mars" was released in the USA.\n\nOn this sol in 189: Mariner 3 failed during launch.';
    if (doI == 60)
	ThisSol = 'On this sol in 208: A meteorite, designated Sayh al Uhaymir 051, was discovered near Sayh al Uhaymir, Oman. The meteorite was later identified as having originated on Mars.';
    if (doI == 61)
	ThisSol = '';
    if (doI == 62)
	ThisSol = '';
    if (doI == 63)
	ThisSol = '';
    if (doI == 64)
	ThisSol = '';
    if (doI == 65)
	ThisSol = '';
    if (doI == 66)
	ThisSol = 'On this sol in 205: A meteorite, designated QUE 94201, was discovered in the Queen Alexandra Range, Antarctica. The meteorite was later identified as having originated on Mars.';
    if (doI == 67)
	ThisSol = '';
    if (doI == 68)
	ThisSol = '';
    if (doI == 69)
	ThisSol = '';
    if (doI == 70)
	ThisSol = 'On this sol in 206: Mars Global Surveyor was launched.\n\nOn this sol in 208: "The Third International Mars Society Convention" opened in Toronto, Ontario.';
    if (doI == 71)
	ThisSol = 'On this sol in 165: Edgar Rice Burroughs� "The Warlord of Mars" was published by McClurg.';
    if (doI == 72)
	ThisSol = '';
    if (doI == 73)
	ThisSol = '';
    if (doI == 74)
	ThisSol = 'On this sol in 171: Wernher von Braun was born, developed the Saturn V launch vehicle, author of "The Mars Project."';
    if (doI == 75)
	ThisSol = '';
    if (doI == 76)
	ThisSol = '';
    if (doI == 77)
	ThisSol = '';
    if (doI == 78)
	ThisSol = 'On this sol in 206: The motion picture "Space Jam" starring Marvin the Martian was released.';
    if (doI == 79)
	ThisSol = 'On this sol in 206: Mars 96 failed during launch.';
    if (doI == 80)
	ThisSol = '';
    if (doI == 81)
	ThisSol = 'On this sol in 189: Mariner 4 was launched.\n\nOn this sol in 206: The third annual "Lunar and Mars Exploration" conference was held in San Diego, California.';
    if (doI == 82)
	ThisSol = '';
    if (doI == 83)
	ThisSol = 'On this sol in 127: Kurd Lasswitz was born, author of "Two Planets."\n\nOn this sol in 189: Zond 2 was launched.';
    if (doI == 84)
	ThisSol = '';
    if (doI == 85)
	ThisSol = '';
    if (doI == 86)
	ThisSol = '';
    if (doI == 87)
	ThisSol = '';
    if (doI == 88)
	ThisSol = 'On this sol in 173: Edgar Rice Burroughs� "The Swords of Mars" began serialization in "Blue Book" (date approximate).';
    if (doI == 89)
	ThisSol = '';
    if (doI == 90)
	ThisSol = 'On this sol in 183: The motion picture "The War of the Worlds" was released in the USA.';
    if (doI == 91)
	ThisSol = '';
    if (doI == 92)
	ThisSol = '';
    if (doI == 93)
	ThisSol = 'On this sol in 045: Christiaan Huygens drew his last sketch of Mars.';
    if (doI == 94)
	ThisSol = '';
    if (doI == 95)
	ThisSol = 'On this sol in 173: Carl Sagan was born, first president of the Planetary Society.';
    if (doI == 96)
	ThisSol = 'On this sol in 206: Mars Pathfinder was launched.';
    if (doI == 97)
	ThisSol = '';
    if (doI == 98)
	ThisSol = '';
    if (doI == 99)
	ThisSol = '';
    if (doI == 100)
	ThisSol = 'On this sol in 153: H. G. Wells� "The War of the Worlds" began serialization in England in "Pearson�s" (date approximate).';
    if (doI == 101)
	ThisSol = '';
    if (doI == 102)
	ThisSol = '';
    if (doI == 103)
	ThisSol = '';
    if (doI == 104)
	ThisSol = 'On this sol in 201: "The Case For Mars III" conference opened in Boulder, Colorado.';
    if (doI == 105)
	ThisSol = 'On this sol in 206: The motion picture "Mars Attacks!" was released in the USA.';
    if (doI == 106)
	ThisSol = '';
    if (doI == 107)
	ThisSol = 'On this sol in 164: Arthur C. Clarke was born, author of "The Sands of Mars."\n\nOn this sol in 208: "The Fifth International Mars Society Convention" opened in Boulder, Colorado.';
    if (doI == 108)
	ThisSol = '';
    if (doI == 109)
	ThisSol = 'On this sol in 197: A meteorite, designated EETA 79001, was discovered in the Elephant Moraine, Antarctica. The meteorite was later identified as having originated on Mars.';
    if (doI == 110)
	ThisSol = '';
    if (doI == 111)
	ThisSol = '';
    if (doI == 112)
	ThisSol = '';
    if (doI == 113)
	ThisSol = '';
    if (doI == 114)
	ThisSol = '';
    if (doI == 115)
	ThisSol = 'On this sol in 203: "America at the Threshold: America�s Space Exploration Initiative" ("The Stafford Report") called for manned missions to Mars beginning in 215.';
    if (doI == 116)
	ThisSol = '';
    if (doI == 117)
	ThisSol = 'On this sol in 152: "The San Francisco Chronicle" reported that an observer had read the name of the Almighty in Hebrew letters on the surface of Mars.';
    if (doI == 118)
	ThisSol = 'On this sol in 176: Edgar Rice Burroughs began writing "John Carter and the Pits of Horz," first of a series for new book. The story was later was published under the title "The City of Mummies."';
    if (doI == 119)
	ThisSol = '';
    if (doI == 120)
	ThisSol = '';
    if (doI == 121)
	ThisSol = '';
    if (doI == 122)
	ThisSol = 'On this sol in 182: The motion picture "Flight to Mars" was released in the USA.';
    if (doI == 123)
	ThisSol = '';
    if (doI == 124)
	ThisSol = '';
    if (doI == 125)
	ThisSol = '';
    if (doI == 126)
	ThisSol = '';
    if (doI == 127)
	ThisSol = '';
    if (doI == 128)
	ThisSol = '';
    if (doI == 129)
	ThisSol = 'On this sol in 153: H. G. Wells� "The War of the Worlds" began serialization in the USA in "Cosmopolitan" (date approximate).';
    if (doI == 130)
	ThisSol = '';
    if (doI == 131)
	ThisSol = '';
    if (doI == 132)
	ThisSol = '';
    if (doI == 133)
	ThisSol = '';
    if (doI == 134)
	ThisSol = '';
    if (doI == 135)
	ThisSol = 'On this sol in 206: Marvin the Martian appeared in "The Springfield Files" episode of the animated television series "The Simpsons."';
    if (doI == 136)
	ThisSol = '';
    if (doI == 137)
	ThisSol = '';
    if (doI == 138)
	ThisSol = '';
    if (doI == 139)
	ThisSol = '';
    if (doI == 140)
	ThisSol = '';
    if (doI == 141)
	ThisSol = '';
    if (doI == 142)
	ThisSol = '';
    if (doI == 143)
	ThisSol = '';
    if (doI == 144)
	ThisSol = 'On this sol in 207: Mars Climate Orbiter was launched.';
    if (doI == 145)
	ThisSol = 'On this sol in 181: Japanese astronomer Sadao Saeki saw a huge explosion on Mars which produced a mushroom cloud 1450 km in diameter "like the terrific explosion of a volcano." No other people observed this explosion.';
    if (doI == 146)
	ThisSol = '';
    if (doI == 147)
	ThisSol = '';
    if (doI == 148)
	ThisSol = 'On this sol in 188: Contact with Mars 1 was lost enroute to Mars.';
    if (doI == 149)
	ThisSol = 'On this sol in 202: US President George H. W. Bush launched the Space Exploration Initiative from the steps of the National Air & Space Museum on the 20th anniversary of the Apollo 11 moon landing, calling for "a journey into tomorrow, a journey to another planet - a manned mission to Mars."';
    if (doI == 150)
	ThisSol = '';
    if (doI == 151)
	ThisSol = 'Aphelion (nominal date).';
    if (doI == 152)
	ThisSol = '';
    if (doI == 153)
	ThisSol = '';
    if (doI == 154)
	ThisSol = '';
    if (doI == 155)
	ThisSol = '';
    if (doI == 156)
	ThisSol = '';
    if (doI == 157)
	ThisSol = '';
    if (doI == 158)
	ThisSol = '';
    if (doI == 159)
	ThisSol = '';
    if (doI == 160)
	ThisSol = '';
    if (doI == 161)
	ThisSol = '';
    if (doI == 162)
	ThisSol = '';
    if (doI == 163)
	ThisSol = 'On this sol in 210: "The Seventh International Mars Society Convention" opened in Chicago, Illinois.';
    if (doI == 164)
	ThisSol = 'On this sol in 165: Isaac Asimov was born, author of "The Martian Way."';
    if (doI == 165)
	ThisSol = '';
    if (doI == 166)
	ThisSol = '';
    if (doI == 167)
	ThisSol = 'On this sol in 207: Mars Polar Lander was launched.';
    if (doI == 168)
	ThisSol = '';
    if (doI == 169)
	ThisSol = 'On this sol in 209: A meteorite, designated Sayh al Uhaymir 150, was discovered near Dar al Sayh al Uhaymir, Oman. The meteorite was later identified as having originated on Mars.';
    if (doI == 170)
	ThisSol = 'On this sol in 202: "Mars is essentially in the same orbit. Mars is somewhat the same distance from the sun, which is very important. We have seen pictures where there are canals, we believe, and water. If there is water, that means there is oxygen. If oxygen, that means we can breathe." -- US Vice President Dan Quayle';
    if (doI == 171)
	ThisSol = 'On this sol in 171: The Mercury Theater of the Air, starring Orson Welles, performed Howard Koch�s radio play "Invasion from Mars." The broadcast terrorized the eastern USA.';
    if (doI == 172)
	ThisSol = '';
    if (doI == 173)
	ThisSol = '';
    if (doI == 174)
	ThisSol = 'On this sol in 163: Edgar Rice Burroughs� "Thuvia, Maid of Mars" began serialization in "All-Story Weekly."';
    if (doI == 175)
	ThisSol = '';
    if (doI == 176)
	ThisSol = '';
    if (doI == 177)
	ThisSol = 'On this sol in 195: Viking 1 entered Mars orbit.\n\nOn this sol in 208: A meteorite, designated Y000593, was discovered in the Yamato Mountains, Antarctica. The meteorite was later identified as having originated on Mars.';
    if (doI == 178)
	ThisSol = 'On this sol in 175: The motion picture "Mars Attacks the World" was released in the USA.';
    if (doI == 179)
	ThisSol = '';
    if (doI == 180)
	ThisSol = '';
    if (doI == 181)
	ThisSol = 'On this sol in 204: "The Case For Mars V" conference opened in Boulder, Colorado.\n\nOn this sol in 208: A meteorite, designated Y000749, was discovered in the Yamato Mountains, Antarctica. The meteorite was later identified as having originated on Mars.';
    if (doI == 182)
	ThisSol = 'On this sol in 176: Edgar Rice Burroughs began writing "The Black Pirates of Barsoom," part 2 of a new Mars series.';
    if (doI == 183)
	ThisSol = '';
    if (doI == 184)
	ThisSol = '';
    if (doI == 185)
	ThisSol = '';
    if (doI == 186)
	ThisSol = '';
    if (doI == 187)
	ThisSol = '';
    if (doI == 188)
	ThisSol = 'On this sol in 188: The television series "My Favorite Martian" ended with the 107th episode.';
    if (doI == 189)
	ThisSol = 'On this sol in 117: Asaph Hall was born, discoverer of Phobos and Deimos.';
    if (doI == 190)
	ThisSol = '';
    if (doI == 191)
	ThisSol = '';
    if (doI == 192)
	ThisSol = '';
    if (doI == 193)
	ThisSol = 'Summer Solstice (nominal date).';
    if (doI == 194)
	ThisSol = '';
    if (doI == 195)
	ThisSol = 'On this sol in 157: "The New York Times" reported that Nikola Tesla might use an oscillator to "wake up" Mars.';
    if (doI == 196)
	ThisSol = 'On this sol in 197: Contact with Viking Lander 2 was lost after 1,280 sols in Utopia Planitia.';
    if (doI == 197)
	ThisSol = 'On this sol in 184: Fredric Brown�s "Martians, Go Home" was published (date approximate).';
    if (doI == 198)
	ThisSol = '';
    if (doI == 199)
	ThisSol = '';
    if (doI == 200)
	ThisSol = '';
    if (doI == 201)
	ThisSol = '';
    if (doI == 202)
	ThisSol = '';
    if (doI == 203)
	ThisSol = '';
    if (doI == 204)
	ThisSol = '';
    if (doI == 205)
	ThisSol = 'On this sol in 207: The motion picture "My Favorite Martian" was released in the USA.';
    if (doI == 206)
	ThisSol = '';
    if (doI == 207)
	ThisSol = '';
    if (doI == 208)
	ThisSol = 'On this sol in 176: Edgar Rice Burroughs began writing "Escape on Mars," part 3 of a new Mars series. The story was later was published under the title "The Yellow Men of Mars."\n\nOn this date in 195: Viking Lander 1 achieved first successful landing on Mars in Chryse Planitia. The spacecraft was later renamed the Thomas A. Mutch Memorial Station.\n\nOn this sol in 209: A meteorite, designated Sayh al Uhaymir 120, was discovered near Dar al Sayh al Uhaymir, Oman. The meteorite was later identified as having originated on Mars.';
    if (doI == 209)
	ThisSol = 'On this sol in 171: Edgar Rice Burroughs� "A Fighting Man of Mars" was published by "Metropolitan."';
    if (doI == 210)
	ThisSol = '';
    if (doI == 212)
	ThisSol = '';
    if (doI == 212)
	ThisSol = '';
    if (doI == 213)
	ThisSol = 'On this sol in 195: Viking Orbiter 1 frame 35A72 imaged Cydonia Face and Pyramids.';
    if (doI == 214)
	ThisSol = '';
    if (doI == 215)
	ThisSol = 'On this sol in 147: Henri Perrotin and Louis Thollon confirmed the existence of the canali.';
    if (doI == 216)
	ThisSol = '';
    if (doI == 217)
	ThisSol = '';
    if (doI == 218)
	ThisSol = '';
    if (doI == 219)
	ThisSol = 'On this sol in 193: Contact with Mariner 9 was lost after 338 sols in Mars orbit.';
    if (doI == 220)
	ThisSol = 'On this sol in 188: The first "Symposium on the Exploration of Mars" opened in Denver, Colorado. This was the first conference devoted to the exploration of Mars via spacecraft.';
    if (doI == 221)
	ThisSol = '';
    if (doI == 222)
	ThisSol = 'On this sol in 195: Viking Orbiter 1 frames 43A01 through 43A04 imaged Deuteronilus Crater Pyramid.';
    if (doI == 223)
	ThisSol = '';
    if (doI == 224)
	ThisSol = '';
    if (doI == 225)
	ThisSol = 'On this sol in 195: Viking 2 entered Mars orbit.';
    if (doI == 226)
	ThisSol = '';
    if (doI == 227)
	ThisSol = '';
    if (doI == 228)
	ThisSol = 'On this sol in 183: I. M. Levitt�s Earth-Mars Clock debuted in New York, New York.';
    if (doI == 229)
	ThisSol = '';
    if (doI == 230)
	ThisSol = '';
    if (doI == 231)
	ThisSol = '';
    if (doI == 232)
	ThisSol = 'On this sol in 176: Edgar Rice Burroughs began writing "The Invisible Men of Mars," part 4 of a new Mars series.';
    if (doI == 233)
	ThisSol = 'On this sol in 136: A meteorite fell near Shergotty, India. In the 1980s, the Shergotty meteorite was identified as having originated on Mars.';
    if (doI == 234)
	ThisSol = 'On this sol in 152: "The observations of 1894 have made it practically certain that the so-called �canals� of Mars are real, whatever may be their explanation," Princeton astronomer Charles A. Young declared in his article for "Cosmopolitan," "Mr. Lowell�s Theory of Mars" (date approximate).\n\nOn this sol in 158: In a letter to "The New York Times," Nikola Tesla declared, "I can easily bridge the gulf which separates us from Mars."\n\nOn this sol in 162: Edgar Rice Burroughs began writing "The Gods of Mars."';
    if (doI == 235)
	ThisSol = '';
    if (doI == 236)
	ThisSol = 'On this sol in 188: Mars 1 passed Mars three months after contact was lost./n/nOn this sol in 206: "Workshop on Early Mars" opened in Houston, Texas.';
    if (doI == 237)
	ThisSol = '';
    if (doI == 238)
	ThisSol = 'On this sol in 175: Edgar Rice Burroughs� "The Synthetic Men of Mars" was published in "Argosy."';
    if (doI == 239)
	ThisSol = '';
    if (doI == 240)
	ThisSol = '';
    if (doI == 241)
	ThisSol = 'On this sol in 185: Isaac Asimov�s "I�m in Marsport without Hilda" appeared in "Venture Science Fiction" (date approximate).';
    if (doI == 242)
	ThisSol = '';
    if (doI == 243)
	ThisSol = '';
    if (doI == 244)
	ThisSol = '';
    if (doI == 245)
	ThisSol = '';
    if (doI == 246)
	ThisSol = 'On this sol in 205: The "Mars Together" conference opened in Palo Alto, California.\n\nOn this sol in 208: A meteorite, designated Sayh al Uhaymir 094, was discovered near Sayh al Uhaymir, Oman. The meteorite was later identified as having originated on Mars.';
    if (doI == 247)
	ThisSol = 'On this sol in 181: Ray Bradbury�s "The Martian Chronicles" was published (date approximate).';
    if (doI == 248)
	ThisSol = 'On this sol in 195: Viking Orbiter 1 frame 70A13 imaged the Cydonia Face and Pyramids.';
    if (doI == 249)
	ThisSol = '';
    if (doI == 250)
	ThisSol = '';
    if (doI == 251)
	ThisSol = 'On this sol in 195: Viking Lander 2 landed in Utopia Planitia.';
    if (doI == 252)
	ThisSol = 'On this sol in 191: Mariner 6 was launched.';
    if (doI == 253)
	ThisSol = 'On this sol in 166: Edgar Rice Burroughs� "The Chessmen of Mars" began serialization in "Argosy All-Story Weekly."';
    if (doI == 254)
	ThisSol = 'On this sol in 196: Contact with Viking Orbiter 2 was lost after 697 sols in Mars orbit.';
    if (doI == 255)
	ThisSol = '';
    if (doI == 256)
	ThisSol = '';
    if (doI == 257)
	ThisSol = '';
    if (doI == 258)
	ThisSol = '';
    if (doI == 259)
	ThisSol = '';
    if (doI == 260)
	ThisSol = 'On this sol in 182: Leigh Brackett�s "The Last Days of Shandakor" appeared in "Startling Stories" (date approximate).';
    if (doI == 261)
	ThisSol = '';
    if (doI == 262)
	ThisSol = '';
    if (doI == 263)
	ThisSol = '';
    if (doI == 264)
	ThisSol = '';
    if (doI == 265)
	ThisSol = '';
    if (doI == 266)
	ThisSol = 'On this sol in 195: Viking Orbiter 1 frame 86A10 imaged the Utopia Faces.\n\nOn this sol in 204: Contact with Mars Observer was lost enroute to Mars.\n\nOn this sol in 208: Thomas W. Cronin�s "As it Is on Mars" was published.';
    if (doI == 267)
	ThisSol = '';
    if (doI == 268)
	ThisSol = '';
    if (doI == 269)
	ThisSol = 'On this sol in 202: NASA�s "Report of the 90-Day Study on Human Exploration of the Moon and Mars" estimated the cost of a manned Mars program at $450 billion. Political support for manned Mars missions subsequently collapsed.\n\nOn this sol in 204: Mars Observer passed Mars three days after contact was lost.';
    if (doI == 270)
	ThisSol = '';
    if (doI == 271)
	ThisSol = '';
    if (doI == 272)
	ThisSol = '';
    if (doI == 273)
	ThisSol = '';
    if (doI == 274)
	ThisSol = 'On this sol in 176: Edgar Rice Burroughs� "John Carter and the Giant of Mars" appeared in "Amazing Stories" (date approximate). The story was later included in the anthology "John Carter of Mars."';
    if (doI == 275)
	ThisSol = '';
    if (doI == 276)
	ThisSol = 'On this sol in 204: Sailor Mars first appeared in the manga "Run Run."';
    if (doI == 277)
	ThisSol = '';
    if (doI == 278)
	ThisSol = '';
    if (doI == 279)
	ThisSol = 'On this sol in 191: Mariner 7 was launched.';
    if (doI == 280)
	ThisSol = '';
    if (doI == 281)
	ThisSol = 'On this sol in 191: Mars 1969A failed during launch.';
    if (doI == 282)
	ThisSol = '';
    if (doI == 283)
	ThisSol = '';
    if (doI == 284)
	ThisSol = '';
    if (doI == 285)
	ThisSol = '';
    if (doI == 286)
	ThisSol = 'On this sol in 195: "Today we have touched Mars. There is life on Mars and it is us--extensions of our eyes in all directions, extensions of our mind, extensions of our heart and soul have touched Mars today. That�s the message to look for there: We are on Mars. We are the Martians!" --Ray Bradbury, speaking at "The Search for Life in the Solar System" symposium in Pasadena, California.';
    if (doI == 287)
	ThisSol = 'On this sol in 180: Marvin the Martian first appeared in animated short film "Haredevil Hare."\n\nOn this sol in 184: Robert A. Heinlein�s "Double Star" began serialization in "Astounding Science Fiction" (date approximate).';
    if (doI == 288)
	ThisSol = '';
    if (doI == 289)
	ThisSol = '';
    if (doI == 290)
	ThisSol = '';
    if (doI == 291)
	ThisSol = '';
    if (doI == 292)
	ThisSol = '';
    if (doI == 293)
	ThisSol = '';
    if (doI == 294)
	ThisSol = 'On this sol in 152: Percival Lowell�s "Mars" was published (date approximate).\n\nOn this sol in 183: The motion picture "Mars and Beyond" was released in the USA.';
    if (doI == 295)
	ThisSol = '';
    if (doI == 296)
	ThisSol = '';
    if (doI == 297)
	ThisSol = '';
    if (doI == 298)
	ThisSol = '';
    if (doI == 299)
	ThisSol = 'On this sol in 191: Mars 1969B failed during launch.';
    if (doI == 300)
	ThisSol = 'On this sol in 206: William K. Hartmann�s "Mars Underground" was published (date approximate).';
    if (doI == 301)
	ThisSol = '';
    if (doI == 302)
	ThisSol = '';
    if (doI == 303)
	ThisSol = 'On this sol in 206: Mars Pathfinder landed in Ares Vallis. The spacecraft was later renamed the Carl Sagan Memorial Station.\n\nOn this sol in 208: Mars Odyssey was launched.';
    if (doI == 304)
	ThisSol = 'On this sol in 189: Mariner 4 achieved the first flyby of Mars, transmitted images of a cratered surface.';
    if (doI == 305)
	ThisSol = 'On this sol in 206: Sojourner, the first roving vehicle on Mars, deployed from the Carl Sagan Memorial Station.';
    if (doI == 306)
	ThisSol = '';
    if (doI == 307)
	ThisSol = '';
    if (doI == 308)
	ThisSol = '';
    if (doI == 309)
	ThisSol = 'On this sol in 209: Thomas W. Cronin�s "Give Us This Mars" was published.';
    if (doI == 310)
	ThisSol = 'On this sol in 197: Contact with Viking Orbiter 1 was lost after 1,469 sols in Mars orbit.';
    if (doI == 311)
	ThisSol = 'On this sol in 132: Angelo Secchi described "a large, triangular patch." Then known as the Hourglass Sea, Secchi instead called it the Canale Atlantico, the first use of the word canale applied to Mars. The feature was later named Syrtis Major by Giovanni Schiaparelli.';
    if (doI == 312)
	ThisSol = '';
    if (doI == 313)
	ThisSol = '';
    if (doI == 314)
	ThisSol = '';
    if (doI == 315)
	ThisSol = '';
    if (doI == 316)
	ThisSol = '';
    if (doI == 317)
	ThisSol = '';
    if (doI == 318)
	ThisSol = '';
    if (doI == 319)
	ThisSol = '';
    if (doI == 320)
	ThisSol = '';
    if (doI == 321)
	ThisSol = '';
    if (doI == 322)
	ThisSol = '';
    if (doI == 323)
	ThisSol = '';
    if (doI == 324)
	ThisSol = '';
    if (doI == 325)
	ThisSol = '';
    if (doI == 326)
	ThisSol = 'On this sol in 189: Zond 2 passed Mars four months after contact was lost.';
    if (doI == 327)
	ThisSol = '';
    if (doI == 328)
	ThisSol = '';
    if (doI == 329)
	ThisSol = '';
    if (doI == 330)
	ThisSol = '';
    if (doI == 331)
	ThisSol = '';
    if (doI == 332)
	ThisSol = 'On this sol in 176: Edgar Rice Burroughs� "The City of Mummies" appeared in "Amazing Stories" (date approximate). The story was later included in the anthology "Llana of Gathol."';
    if (doI == 333)
	ThisSol = '';
    if (doI == 334)
	ThisSol = '';
    if (doI == 335)
	ThisSol = 'On this sol in 188: The television series "My Favorite Martian" debuted.\n\nOn this sol in 205: Sailor Mars first appeared in "An Uncharmed Life" episode of the animated television series "Sailor Moon" (USA air date).';
    if (doI == 336)
	ThisSol = '';
    if (doI == 337)
	ThisSol = '';
    if (doI == 338)
	ThisSol = '';
    if (doI == 339)
	ThisSol = '';
    if (doI == 340)
	ThisSol = '';
    if (doI == 341)
	ThisSol = 'On this sol in 193: Lin Carter�s "The Man Who Loved Mars" was published (date approximate).';
    if (doI == 342)
	ThisSol = '';
    if (doI == 343)
	ThisSol = '';
    if (doI == 344)
	ThisSol = '';
    if (doI == 345)
	ThisSol = '';
    if (doI == 346)
	ThisSol = '';
    if (doI == 347)
	ThisSol = 'On this sol in 177: Edgar Rice Burroughs� "The Skeleton Men of Jupiter" appeared in "Amazing Stories" (date approximate). Later included in the anthology "John Carter of Mars."';
    if (doI == 348)
	ThisSol = '';
    if (doI == 349)
	ThisSol = '';
    if (doI == 350)
	ThisSol = '';
    if (doI == 351)
	ThisSol = 'On this sol in 158: The Martians launched the first of ten cylinders toward Earth, beginning the War of the Worlds.';
    if (doI == 352)
	ThisSol = 'On this sol in 158: During the War of the Worlds, the Martians launched the second of ten cylinders toward Earth.';
    if (doI == 353)
	ThisSol = 'On this sol in 158: During the War of the Worlds, the Martians launched the third of ten cylinders toward Earth.';
    if (doI == 354)
	ThisSol = 'On this sol in 158: During the War of the Worlds, the Martians launched the foutth of ten cylinders toward Earth.';
    if (doI == 355)
	ThisSol = 'On this sol in 152: In the first of a series of 40 seances, the spiritualist medium Catherine Elise Mueller communicated with Martians, speaking in their language, and in some seances, writing in Martian.\n\nOn this sol in 158: During the War of the Worlds, the Martians launched the fifth of ten cylinders toward Earth.';
    if (doI == 356)
	ThisSol = 'On this sol in 158: During the War of the Worlds, the Martians launched the sixth of ten cylinders toward Earth.\n\nOn this sol in 189: "I say let�s do it quickly and establish a foothold on a new planet while we still have one left to take off from." --Wernher von Braun, "Manned Mars Landing," "Aviation Week & Space Technology."';
    if (doI == 357)
	ThisSol = 'On this sol in 158: During the War of the Worlds, the Martians launched the seventh of ten cylinders toward Earth.';
    if (doI == 358)
	ThisSol = 'On this sol in 158: During the War of the Worlds, the Martians launched the eighth of ten cylinders toward Earth.';
    if (doI == 359)
	ThisSol = 'On this sol in 158: During the War of the Worlds, the Martians launched the ninth of ten cylinders toward Earth.';
    if (doI == 360)
	ThisSol = 'On this sol in 158: During the War of the Worlds, the Martians launched the last of ten cylinders toward Earth.';
    if (doI == 361)
	ThisSol = '';
    if (doI == 362)
	ThisSol = '';
    if (doI == 363)
	ThisSol = 'On this sol in 192: Mariner 8 failed during launch.';
    if (doI == 364)
	ThisSol = 'On this sol in 190: NASA Manned Spacecraft Center issued "Request for Proposal No. BG721-28-7-528P, Planetary Surface Sample Return Probe Study for Manned Mars/Venus Reconnaissance/Retrieval Missions" in the 1975-1982 time frame. Rep. Joseph Karth, acting chairman of the House Subcommittee on NASA Oversight, who had been fighting an uphill battle to preserve Project Voyager funding, later expressed his exasperation, for the move cast the program of Saturn V-launched unmanned orbiters and landers in the role of a foot in the door for manned follow-on missions to the planets: "Very bluntly, a manned mission to Mars or Venus by 1975 or 1977 is now and always has been out of the question, and anyone who persists in this kind of misallocation of resources at this time will be stopped."';
    if (doI == 365)
	ThisSol = 'On this sol in 192: Kosmos 419 was launched, but failed to leave Earth orbit.';
    if (doI == 366)
	ThisSol = '';
    if (doI == 367)
	ThisSol = 'On this sol in 153: H. G. Wells� "The War of the Worlds" was published as a novella (date approximate).';
    if (doI == 368)
	ThisSol = 'On this sol in 199: "The Case For Mars II" conference opened in Boulder, Colorado.';
    if (doI == 369)
	ThisSol = '';
    if (doI == 370)
	ThisSol = '';
    if (doI == 371)
	ThisSol = 'On this sol in 206: Mars Global Surveyor entered Mars orbit.';
    if (doI == 372)
	ThisSol = 'Autumnal Equinox (nominal date).';
    if (doI == 373)
	ThisSol = '';
    if (doI == 374)
	ThisSol = 'On this sol in 192: Mars 2 was launched.';
    if (doI == 375)
	ThisSol = '';
    if (doI == 376)
	ThisSol = '';
    if (doI == 377)
	ThisSol = 'On this sol in 190: U.S. Congress deleted funding for Voyager, a program of Saturn V-launched unmanned orbiters and landers, then scheduled for its first missions in 1973. The program was later down-scoped and renamed "Viking."';
    if (doI == 378)
	ThisSol = '';
    if (doI == 379)
	ThisSol = '';
    if (doI == 380)
	ThisSol = '';
    if (doI == 381)
	ThisSol = 'On this sol in 208: A meteorite, designated Sayh al Uhaymir 060, was discovered near Sayh al Uhaymir, Oman. The meteorite was later identified as having originated on Mars.';
    if (doI == 382)
	ThisSol = 'On this sol in 158: During the War of the Worlds, the first Martian cylinder landed on Horsell Common, east of Horsell.  The Deputation advanced upon the pit, waving a white flag. There was a flash of light, an invisible ray of heat flashed from man to man, and each burst into flame, killing about 40 people.\n\nOn this sol in 207: "The Second International Mars Society Convention" opened in Boulder, Colorado.';
    if (doI == 383)
	ThisSol = 'On this sol in 158: During the War of the Worlds, the second Martian cylinder landed on the Addlestone Golf Links. A battalion of the Cardigan Regiment rushed the Horsell pit in skirmish order and was annihilated by the Heat-Ray. The fighting-machine then destroyed Woking.\n\nOn this sol in 192: Mars 3 was launched.';
    if (doI == 384)
	ThisSol = 'On this sol in 158: During the War of the Worlds, the third Martian cylinder landed north of Pyrford, completing the Surrey Triangle. Five Martian fighting-machines advanced down the Wey River to the confluence of the Thames. Royal Army batteries engage the Martians, destroying one fighting-machine, but Weybridge and Chertsey were destroyed by Heat-Ray. Later, the St. George�s Hill battery damaged one fighting-machine, but was then destroyed. Seven Martian fighting-machines fanned out along a curved line between St. George�s Hill, Weybridge, and the village of Send. The Martians discharged Black Smoke across the valley of the Thames, advancing through Street Cobham and Ditton. Richmond, Kingston, and Wimbledon were destroyed.';
    if (doI == 385)
	ThisSol = 'On this sol in 158: During the War of the Worlds, the fourth Martian cylinder landed in Bushey Park, beginning the West End Triangle. The Martians advanced in a line from Hanwell in the north to Coombe and Malden in the south. Organized resistance by the British forces collapsed. The Martians went to and fro over the North Downs between Guildford and Maidstone, using the Black Smoke to eliminate any artillery batteries located there. Police organization in London broke down. The railway system collapsed.\n\nOn this sol in 192: Mariner 9 was launched.';
    if (doI == 386)
	ThisSol = 'On this sol in 158: During the War of the Worlds, the fifth Martian cylinder landed in Sheen, and the sixth Martian cylinder landed in Wimbledon, completing the West End Triangle.';
    if (doI == 387)
	ThisSol = 'On this sol in 158: During the War of the Worlds, the seventh Martian cylinder landed in Primrose Hill, where the invaders established their new headquarters. "HMS Thunder Child" made a suicide run at three fighting-machines the mouth of the Blackwater to cover the escape of passenger vessels. Two fighting-machines were destroyed. "Thunder Child" was also destroyed.';
    if (doI == 388)
	ThisSol = 'On this sol in 158: During the War of the Worlds, the eighth Martian cylinder landed (unreported). A fighting-machine destroyed Leatherhead, with every soul in it.';
    if (doI == 389)
	ThisSol = 'On this sol in 158: During the War of the Worlds, the ninth Martian cylinder landed (unreported). The Martians vacated the Sheen cylinder except for one fighting-machine and one handling-machine.';
    if (doI == 390)
	ThisSol = 'On this sol in 158: During the War of the Worlds, the last of ten Martian cylinder landed (unreported).';
    if (doI == 391)
	ThisSol = 'On this sol in 165: Ray Bradbury was born, author of "The Martian Chronicles."\n\nOn this sol in 169: Edgar Rice Burroughs began dictating "A Fighting Man of Mars" on Ediphone.';
    if (doI == 392)
	ThisSol = 'On this sol in 207: A meteorite, designated Dar al Gani 975, was discovered near Dar al Gani, Libya. The meteorite was later identified as having originated on Mars.';
    if (doI == 393)
	ThisSol = '';
    if (doI == 394)
	ThisSol = '';
    if (doI == 395)
	ThisSol = 'On this sol in 206: Contact with the Carl Sagan Memorial Station (Mars Pathfinder) was lost after 93 sols in Ares Vallis.';
    if (doI == 396)
	ThisSol = '';
    if (doI == 397)
	ThisSol = '';
    if (doI == 398)
	ThisSol = '';
    if (doI == 399)
	ThisSol = '';
    if (doI == 400)
	ThisSol = 'On this sol in 209: Mars Express was launched.';
    if (doI == 401)
	ThisSol = '';
    if (doI == 402)
	ThisSol = 'On this sol in 158: The last Martians succumbed to terrestrial disease, ending the War of the Worlds.\n\nOn this sol in 201: Soviet President Mikhail Gorbachev called for a joint unmanned Mars mission with the USA.';
    if (doI == 403)
	ThisSol = '';
    if (doI == 404)
	ThisSol = 'On this sol in 158: Robert A. Heinlein was born, author of "Red Planet," "Podkayne of Mars," and "Stranger in a Strange Land."\n\nOn this sol in 159: Nikola Tesla discussed communication with Mars in an article in "The New York Times."\n\nOn this sol in 191: Mariner 6 passed Mars.';
    if (doI == 405)
	ThisSol = '';
    if (doI == 406)
	ThisSol = '';
    if (doI == 407)
	ThisSol = '';
    if (doI == 408)
	ThisSol = 'On this sol in 209: Mars Exploration Rover Spirit was launched.';
    if (doI == 409)
	ThisSol = 'On this sol in 191: Mariner 7 passed Mars.';
    if (doI == 410)
	ThisSol = 'On this sol in 201: The Planetary Society�s "Mars Declaration" was published in "The Washington Post."';
    if (doI == 411)
	ThisSol = '';
    if (doI == 412)
	ThisSol = '';
    if (doI == 413)
	ThisSol = 'On this sol in 191: Members of the Charles Manson "family," a Martian nest patterned on Robert A. Heinlein�s "Stranger in a Strange Land," murdered actress Sharon Tate and four others in Los Angeles.';
    if (doI == 414)
	ThisSol = 'On this sol in 191: Members of the Charles Manson "family," a Martian nest patterned on Robert A. Heinlein�s "Stranger in a Strange Land," murdered Leno and Rosemary LaBianca in Los Angeles.';
    if (doI == 415)
	ThisSol = '';
    if (doI == 416)
	ThisSol = '';
    if (doI == 417)
	ThisSol = '';
    if (doI == 418)
	ThisSol = 'Storm season begins.';
    if (doI == 419)
	ThisSol = '';
    if (doI == 420)
	ThisSol = 'On this sol in 119: Giovanni Schiaparelli was born, developed first detailed maps of Mars and originated the system of areographic nomenclature in use today.\n\nOn this sol in 200: The "NASA Mars Conference" opened in Washington, DC.';
    if (doI == 421)
	ThisSol = 'On this sol in 176: Edgar Rice Burroughs� "The Black Pirates of Barsoom" appeared in "Amazing Stories" (date approximate). The story was later included in the anthology "Llana of Gathol."';
    if (doI == 422)
	ThisSol = 'On this sol in 203: US President George H. W. Bush issued National Space Policy Directive 6, "Space Exploration Initiative," calling for human expeditions to Mars.';
    if (doI == 423)
	ThisSol = 'On this sol in 207: Two meteorites, designated Los Angeles 001 and 002, were discovered in the Mojave Desert near Los Angeles, California. The meteorites were later identified as having originated on Mars.';
    if (doI == 424)
	ThisSol = '';
    if (doI == 425)
	ThisSol = '';
    if (doI == 426)
	ThisSol = '';
    if (doI == 427)
	ThisSol = '';
    if (doI == 428)
	ThisSol = 'On this sol in 202: Voicing his opposition to the Bush Administration�s Space Exploration Initiative, Senator Albert Gore, Jr. told his fellow legislators, "Before discussing a mission to Mars, the Administration needs a mission to reality."';
    if (doI == 429)
	ThisSol = 'On this sol in 151: The Lowell Observatory began its study of Mars. Eighteen months later, Percival Lowell was published the observations of the 151 opposition in a popular book, Mars.';
    if (doI == 430)
	ThisSol = '';
    if (doI == 431)
	ThisSol = 'On this sol in 091: William Herschel calculated a rotational period for Mars of 24 hours, 39 minutes, and 21.67 seconds. He also confirmed that the north polar spot was eccentric to the pole.';
    if (doI == 432)
	ThisSol = '';
    if (doI == 433)
	ThisSol = '';
    if (doI == 434)
	ThisSol = 'On this sol in 209: Mars Exploration Rover Opportunity was launched.';
    if (doI == 435)
	ThisSol = 'On this sol in 191: A NASA report to US President Richard Nixon�s Space Task Group, which was chartered to explore options for space efforts beyond the Apollo program, stated, "Manned expeditions to Mars could begin as early as 1981."';
    if (doI == 436)
	ThisSol = 'On this sol in 202: George Bush became the first US President to set a target date for sending humans to Mars: "I believe that before America celebrates the 50th anniversary of its landing on the Moon, the American flag should be planted on Mars."';
    if (doI == 437)
	ThisSol = 'On this sol in 208: "The Fourth International Mars Society Convention" opened at Stanford University, California.';
    if (doI == 438)
	ThisSol = '';
    if (doI == 439)
	ThisSol = '';
    if (doI == 440)
	ThisSol = 'On this sol in 015: Two years after making his first drawing of Mars, Neapolitan lawyer and amateur astronomer Francesco Fontana produced a second drawing, which like the first, featured a dark spot, which has been attributed to an optical defect in his telescope.';
    if (doI == 441)
	ThisSol = '';
    if (doI == 442)
	ThisSol = '';
    if (doI == 443)
	ThisSol = '';
    if (doI == 444)
	ThisSol = '';
    if (doI == 445)
	ThisSol = '';
    if (doI == 446)
	ThisSol = '';
    if (doI == 447)
	ThisSol = 'On this sol in 176: Edgar Rice Burroughs� "The Black Pirates of Barsoom" was published in Amazing Stories.\n\nOn this sol in 198: Contact with the Thomas A. Mutch Memorial Station (Viking Lander 1) was lost after 2,244 sols in Chryse Planitia.';
    if (doI == 448)
	ThisSol = '';
    if (doI == 449)
	ThisSol = 'On this sol in 158: I. M. Levitt was born, inventor of a Martian calendar and the first Earth-Mars mechanical date-time computer.\n\nOn this sol in 191: The report by US President Richard Nixon�s Space Task Group, "The Post-Apollo Space Program: Directions for the Future," stated, "We conclude that NASA has the demonstrated organizational competence and technology base, by virtue of the Apollo success and other achievements, to carry out a successful program to land man on Mars within 15 years." Nevertheless, the report backed away from an early manned landing on Mars, recommending that the focus for the next decades in space should be on the development of hardware and systems that would ultimately support a manned mission to Mars at the close of the 20th century.';
    if (doI == 450)
	ThisSol = 'On this sol in 201: Phobos 1 was launched.';
    if (doI == 451)
	ThisSol = 'On this sol in 141: Edgar Rice Burroughs was born, author of the "Barsoom" series.';
    if (doI == 452)
	ThisSol = '';
    if (doI == 453)
	ThisSol = '';
    if (doI == 454)
	ThisSol = '';
    if (doI == 455)
	ThisSol = 'On this sol in 010: Christiaan Huygens was born, drew the first identifiable Martian surface feature.\n\nOn this sol in 201: Phobos 2 was launched.';
    if (doI == 456)
	ThisSol = '';
    if (doI == 457)
	ThisSol = 'On this sol in 202: The motion picture "Total Recall" was released in the USA.';
    if (doI == 458)
	ThisSol = '';
    if (doI == 459)
	ThisSol = 'On this sol in 202: "The Case For Mars IV" conference opened in Boulder, Colorado.';
    if (doI == 460)
	ThisSol = 'On this sol in 170: Edgar Rice Burroughs� "A Fighting Man of Mars" began serialization in "Blue Book" (date approximate).';
    if (doI == 461)
	ThisSol = '';
    if (doI == 462)
	ThisSol = '';
    if (doI == 463)
	ThisSol = '';
    if (doI == 464)
	ThisSol = '';
    if (doI == 465)
	ThisSol = '';
    if (doI == 466)
	ThisSol = '';
    if (doI == 467)
	ThisSol = '';
    if (doI == 468)
	ThisSol = '';
    if (doI == 469)
	ThisSol = 'On this sol in 182: Isaac Asimov�s "The Martian Way" appeared in "Galaxy Science Fiction" (date approximate).\n\nOn this sol in 210: The motion picture "The War of the Worlds" was released in the USA.';
    if (doI == 470)
	ThisSol = '';
    if (doI == 471)
	ThisSol = 'On this sol in 125: Omsby MacKnight Mitchel observed a white patch detached from the south polar cap of Mars. The feature became known as the Mountains of Mitchel. Actually it is a depression.';
    if (doI == 472)
	ThisSol = '';
    if (doI == 473)
	ThisSol = 'On this sol in 142: Asaph Hall gave up a search for Martian moons. The following night, having resumed his search at the insistence of his wife, Angelina, he detected a faint object near Mars, which he later named Deimos.';
    if (doI == 474)
	ThisSol = 'On this sol in 142: "The New York Times" asked, "Is Mars inhabited?" in an editorial. As the best opposition since 1798 approached, questions in the popular mind came to the fore and the possibility of life on Mars was discussed in the press.';
    if (doI == 475)
	ThisSol = '';
    if (doI == 476)
	ThisSol = '';
    if (doI == 477)
	ThisSol = '';
    if (doI == 478)
	ThisSol = 'On this sol in 142: Asaph Hall discovered Phobos.';
    if (doI == 479)
	ThisSol = 'On this sol in 193: Mars 4 was launched.';
    if (doI == 480)
	ThisSol = 'On this sol in 142: Asaph Hall announced the discovery of Mars� two moons. At the suggestion of Henry Madan, the Science Master of Eton, England, Hall named the moons Phobos and Deimos.';
    if (doI == 481)
	ThisSol = 'On this sol in 160: An unfortunate dog in Nakhla, Egypt was struck by part of a meteorite and killed. In the 1980s, the Nakhla meteorite was identified as having originated on Mars.';
    if (doI == 482)
	ThisSol = 'On this sol in 176: Edgar Rice Burroughs� "The Yellow Men of Mars" appeared in "Amazing Stories" (date approximate). The story was later included in the anthology "Llana of Gathol."\n\nOn this sol in 184: A dust storm began with a bright cloud over the Hellas-Noachis region that spread to engulf the whole planet by mid-September.';
    if (doI == 483)
	ThisSol = 'On this sol in 193: Mars 5 was launched.';
    if (doI == 484)
	ThisSol = 'On this sol in 160: Writing down his daydreams on the backs of old letterheads of previously failed businesses, Edgar Rice Burroughs used free time at his office to begin "A Princess of Mars" (date approximate).\n\nOn this sol in 203: Sailor Mars first appeared in "An Uncharmed Life" episode of the animated television series "Sailor Moon" (Japan air date).';
    if (doI == 485)
	ThisSol = 'Perihelion (nominal date).\n\nOn this sol in 207: Two meteorites, designated Sayh al Uhaymir 005 and 008, were discovered near Sayh al Uhaymir, Oman. The meteorites were later identified as having originated on Mars.';
    if (doI == 486)
	ThisSol = '';
    if (doI == 487)
	ThisSol = '';
    if (doI == 488)
	ThisSol = '';
    if (doI == 489)
	ThisSol = '';
    if (doI == 490)
	ThisSol = 'On this sol in 142: Henry Draper of New York and Edward Singleton Holden of the U.S. Naval Observatory in Washington claimed to have jointly discovered the third moon at Draper�s private observatory at Hastings-on-the-Hudson. This discovery proved to be false; in fact, the proposed moon did not even obey Kepler�s laws.\n\nOn this sol in 151: The British scientific journal "Nature" reported that the Lick and Nice Observatories had seen a great light on Mars, which was later speculated to have been the casting of the huge gun used to launch the War of the Worlds.';
    if (doI == 491)
	ThisSol = '';
    if (doI == 492)
	ThisSol = 'On this sol in 207: Contact with Mars Polar Lander was lost prior to landing on Mars.';
    if (doI == 493)
	ThisSol = 'On this sol in 185: A few months before it was transformed into a space agency by the National Aeronautics and Space Act, a report by the National Advisory Committee on Aeronautics projected that a manned Mars mission might be undertaken in 1977.';
    if (doI == 494)
	ThisSol = 'On this sol in 193: Mars 6 was launched.';
    if (doI == 495)
	ThisSol = 'On this sol in 208: Mars Odyssey entered Mars orbit.';
    if (doI == 496)
	ThisSol = '';
    if (doI == 497)
	ThisSol = 'On this sol in 193: Mars 7 was launched.';
    if (doI == 498)
	ThisSol = '';
    if (doI == 499)
	ThisSol = '';
    if (doI == 500)
	ThisSol = '';
    if (doI == 501)
	ThisSol = '';
    if (doI == 502)
	ThisSol = '';
    if (doI == 503)
	ThisSol = '';
    if (doI == 504)
	ThisSol = 'On this sol in 142: Giovanni Schiaparelli began a detailed study of Mars for the purpose of drawing a new and accurate map of the planet.';
    if (doI == 505)
	ThisSol = 'On this sol in 201: Contact with Phobos 1 was lost en route to Mars.';
    if (doI == 506)
	ThisSol = '';
    if (doI == 507)
	ThisSol = 'On this sol in 142: Giovanni Schiaparelli observed the canale Cyclops.';
    if (doI == 508)
	ThisSol = '';
    if (doI == 509)
	ThisSol = '';
    if (doI == 510)
	ThisSol = '';
    if (doI == 511)
	ThisSol = '';
    if (doI == 512)
	ThisSol = '';
    if (doI == 513)
	ThisSol = 'On this sol in 162: Orson Welles was born, leader of the Mercury Theater of the Air, which performed the "Panic Broadcast."\n\nOn this sol in 210: "The Sixth International Mars Society Convention" opened in Eugene, Oregon.';
    if (doI == 514)
	ThisSol = 'Winter Solstice (nominal date).\n\nOn this sol in 142: Giovanni Schiaparelli observed the canale Ambrosia.';
    if (doI == 515)
	ThisSol = 'On this sol in 188: Philip K. Dick�s "Martian Time-Slip" was published (date approximate).';
    if (doI == 516)
	ThisSol = '';
    if (doI == 517)
	ThisSol = '';
    if (doI == 518)
	ThisSol = '';
    if (doI == 519)
	ThisSol = '';
    if (doI == 520)
	ThisSol = 'On this sol in 141: Earl C. Slipher wasborn, observed Mars extensively.';
    if (doI == 521)
	ThisSol = '';
    if (doI == 522)
	ThisSol = '';
    if (doI == 523)
	ThisSol = '';
    if (doI == 524)
	ThisSol = '';
    if (doI == 525)
	ThisSol = 'On this sol in 142: Giovanni Schiaparelli observed the canali Ganges and Phison.';
    if (doI == 526)
	ThisSol = 'On this sol in 165: Edgar Rice Burroughs began writing "The Chessmen of Mars."';
    if (doI == 527)
	ThisSol = 'On this sol in 130: Percival Lowell was born, developed detailed maps of Mars and believed in an advanced Martian civilization.';
    if (doI == 528)
	ThisSol = '';
    if (doI == 529)
	ThisSol = '';
    if (doI == 530)
	ThisSol = 'On this sol in 166: Edgar Rice Burroughs� "The Chessmen of Mars" was published by McClurg.\n\nOn this sol in 170: Lin Carter was born, author of "The Man Who Loved Mars."';
    if (doI == 531)
	ThisSol = 'On this sol in 142: Giovanni Schiaparelli observed Mare Erythraeum and Noachis to be obscured by clouds.';
    if (doI == 532)
	ThisSol = '';
    if (doI == 533)
	ThisSol = 'On this sol in 199: A meteorite, designated ALH 84001, was discovered in the Allan Hills, Antarctica. In 1993, the meteorite was identified as having originated on Mars. In 1996, a team of scientists announced evidence on fossilized Martian life in the meteorite.';
    if (doI == 534)
	ThisSol = '';
    if (doI == 535)
	ThisSol = '';
    if (doI == 536)
	ThisSol = '';
    if (doI == 537)
	ThisSol = 'On this sol in 092: William Herschel observed the south polar cap of Mars. "I am inclined to think that the white spot has some little revolution.... It is rather probable that the real pole, though within the spot, may lie near the circumference of it, or one-third of its diameter from one of the sides. A few days more will show it, as I shall now fix my particular attention on it."';
    if (doI == 538)
	ThisSol = '';
    if (doI == 539)
	ThisSol = '';
    if (doI == 540)
	ThisSol = 'On this sol in 160: "Martians Build Two Immense Canals in Two Years" reported in "The New York Times."\n\nOn this sol in 176: Edgar Rice Burroughs� "The Invisible Men of Mars" appeared in Amazing Stories (date approximate). The story was later included in the anthology Llana of Gathol.';
    if (doI == 541)
	ThisSol = 'On this sol in 142: Giovanni Schiaparelli observed the canale Eunostos.';
    if (doI == 542)
	ThisSol = 'On this sol in 207: A meteorite, designated Dhofar 019, was discovered near Dhofar, Oman. The meteorite was later identified as having originated on Mars.';
    if (doI == 543)
	ThisSol = '';
    if (doI == 544)
	ThisSol = '';
    if (doI == 545)
	ThisSol = '';
    if (doI == 546)
	ThisSol = '';
    if (doI == 547)
	ThisSol = 'On this sol in 173: ERB Inc released "The Swords of Mars."';
    if (doI == 548)
	ThisSol = 'On this sol in 192: Mariner 9 became the first spacecraft to orbit Mars.';
    if (doI == 549)
	ThisSol = 'On this sol in 109: A meteorite fell near Chassigny, France. In the 1980s, the Chassigny meteorite was identified as having originated on Mars. It was the first Martian meteorite to be discovered.\n\nOn this sol in 194: Viking 1 was launched.';
    if (doI == 550)
	ThisSol = '';
    if (doI == 551)
	ThisSol = '';
    if (doI == 552)
	ThisSol = '';
    if (doI == 553)
	ThisSol = '';
    if (doI == 554)
	ThisSol = '';
    if (doI == 555)
	ThisSol = '';
    if (doI == 556)
	ThisSol = '';
    if (doI == 557)
	ThisSol = '';
    if (doI == 558)
	ThisSol = '';
    if (doI == 559)
	ThisSol = 'On this sol in 207: A meteorite, designated GRV 9927, was discovered in the Grove Mountains, Antarctica. The meteorite was later identified as having originated on Mars.';
    if (doI == 560)
	ThisSol = '';
    if (doI == 561)
	ThisSol = 'On this sol in 192: Mariner 9 returned the first image of Deimos. Mars 2 Orbiter entered Mars orbit. Mars 2 Lander impacted on Mars.';
    if (doI == 562)
	ThisSol = '';
    if (doI == 563)
	ThisSol = '';
    if (doI == 564)
	ThisSol = 'On this sol in 176: Edgar Rice Burroughs began writing "The Skeleton Men of Jupiter," the first of a planned new John Carter series.\n\nOn this sol in 192: Mariner 9 returned the first image of Phobos.';
    if (doI == 565)
	ThisSol = 'On this sol in 209: A meteorite, designated Sayh al Uhaymir 125, was discovered near Dar al Sayh al Uhaymir, Oman. The meteorite was later identified as having originated on Mars.';
    if (doI == 566)
	ThisSol = 'On this sol in 192: Mars 3 Orbiter entered Mars orbit. Contact with Mars 2 Lander was lost shortly after landing. No useful data was returned.';
    if (doI == 567)
	ThisSol = 'On this sol in 178: The motion picture "The Purple Monster Strikes" was released in the USA.';
    if (doI == 568)
	ThisSol = 'On this sol in 197: "The Case For Mars I" conference opened in Boulder, Colorado.';
    if (doI == 569)
	ThisSol = '';
    if (doI == 570)
	ThisSol = '';
    if (doI == 571)
	ThisSol = 'On this sol in 194: Viking 2 was launched.';
    if (doI == 572)
	ThisSol = '';
    if (doI == 573)
	ThisSol = 'On this sol in 123: Camille Flammarion was born, developed detailed maps of Mars and believed in an advanced civilization on that planet.';
    if (doI == 574)
	ThisSol = '';
    if (doI == 575)
	ThisSol = '';
    if (doI == 576)
	ThisSol = '';
    if (doI == 577)
	ThisSol = '';
    if (doI == 578)
	ThisSol = '';
    if (doI == 579)
	ThisSol = '';
    if (doI == 580)
	ThisSol = '';
    if (doI == 581)
	ThisSol = '';
    if (doI == 582)
	ThisSol = 'On this sol in 208: A meteorite, designated Sayh al Uhaymir 090, was discovered near Dar al Sayh al Uhaymir, Oman. The meteorite was later identified as having originated on Mars.';
    if (doI == 583)
	ThisSol = '';
    if (doI == 584)
	ThisSol = '';
    if (doI == 585)
	ThisSol = '';
    if (doI == 586)
	ThisSol = '';
    if (doI == 587)
	ThisSol = '';
    if (doI == 588)
	ThisSol = '';
    if (doI == 589)
	ThisSol = '';
    if (doI == 590)
	ThisSol = 'On this sol in 143: Discussing the canali in a letter to Nathaniel Green, Giovanni Schiaparelli declared, "It is [as] impossible to doubt their existence as that of the Rhine on the surface of the Earth."\n\nOn this sol in 209: A meteorite, designated MIL 03346, was discovered in the Miller Range of the Transantarctic Mountains. The meteorite was later identified as having originated on Mars.';
    if (doI == 591)
	ThisSol = '';
    if (doI == 592)
	ThisSol = '';
    if (doI == 593)
	ThisSol = '';
    if (doI == 594)
	ThisSol = '';
    if (doI == 595)
	ThisSol = '';
    if (doI == 596)
	ThisSol = 'On this sol in 206: A meteorite, designated Dar al Gani 476, was discovered near Dar al Gani, Libya. The meteorite was later identified as having originated on Mars.';
    if (doI == 597)
	ThisSol = '';
    if (doI == 598)
	ThisSol = '';
    if (doI == 599)
	ThisSol = 'On this sol in 201: Soviet President Mikhail Gorbachev called for a joint manned Mars mission with the USA.';
    if (doI == 600)
	ThisSol = 'On this sol in 209: Mars Express entered orbit. Contact with Beagle 2 was lost prior to landing in Isidis Planitia.';
    if (doI == 601)
	ThisSol = '';
    if (doI == 602)
	ThisSol = 'On this sol in 206: A meteorite, designated Dar al Gani 876, was discovered near Dar al Gani, Libya. The meteorite was later identified as having originated on Mars.';
    if (doI == 603)
	ThisSol = '';
    if (doI == 604)
	ThisSol = 'On this sol in 143: Giovanni Schiaparelli discovered a small white patch in Tharsis and named it Nix Olympica. Nearly a century later, Mariner 9 imagery revealed this feature to be the largest mountain in the Solar System, and the feature was renamed Olympus Mons.';
    if (doI == 605)
	ThisSol = '';
    if (doI == 606)
	ThisSol = '';
    if (doI == 607)
	ThisSol = 'On this sol in 152: Charles A. Young of Princeton University discussed the question "Is Mars Inhabited?" in the Boston Herald.';
    if (doI == 608)
	ThisSol = '';
    if (doI == 609)
	ThisSol = '';
    if (doI == 610)
	ThisSol = 'On this sol in 209: Mars Exploration Rover Spirit landed in Gusev Crater. The spacecraft was later renamed the Columbia Memorial Station.';
    if (doI == 611)
	ThisSol = '';
    if (doI == 612)
	ThisSol = 'Storm season ends.';
    if (doI == 613)
	ThisSol = 'On this sol in 201: A meteorite, designated LEW 88516, was discovered at Lewis Cliff, Antarctica. The meteorite was later identified as having originated on Mars.\n\nOn this sol in 201: Percival Lowell reported "Frost on Mars" to "The New York Times."\n\nOn this sol in 203: Mars Observer was launched.';
    if (doI == 614)
	ThisSol = 'On this sol in 136: H. G. Wells was born, author of "The War of the Worlds."\n\nOn this sol in 188: The motion picture "Robinson Crusoe on Mars" was released in the USA.';
    if (doI == 615)
	ThisSol = '';
    if (doI == 616)
	ThisSol = 'On this sol in 209: Two meteorites, designated Sayh al Uhaymir 130 and 131, were discovered near Dar al Sayh al Uhaymir, Oman. The meteorites were later identified as having originated on Mars.';
    if (doI == 617)
	ThisSol = 'On this sol in 165: The motion picture "A Message from Mars" was released in the USA.\n\nOn this sol in 186: Mars 1960A, the first known Mars mission, failed during launch.';
    if (doI == 618)
	ThisSol = 'On this sol in 161: Edgar Rice Burroughs drew a map of Barsoom at the request of his publisher.';
    if (doI == 619)
	ThisSol = '';
    if (doI == 620)
	ThisSol = 'On this sol in 209: US President George W. Bush announced plans to establish a lunar base to support human missions to Mars.';
    if (doI == 621)
	ThisSol = 'On this sol in 186: Mars 1960B failed during launch.';
    if (doI == 622)
	ThisSol = '';
    if (doI == 623)
	ThisSol = '';
    if (doI == 624)
	ThisSol = '';
    if (doI == 625)
	ThisSol = '';
    if (doI == 626)
	ThisSol = '';
    if (doI == 627)
	ThisSol = '';
    if (doI == 628)
	ThisSol = '';
    if (doI == 629)
	ThisSol = 'On this sol in 174: Edgar Rice Burroughs began writing "The Synthetic Men of Mars."\n\nOn this sol in 205: "The Case for Mars VI" conference opened in Boulder, Colorado.';
    if (doI == 630)
	ThisSol = 'On this sol in 209: Mars Exploration Rover Opportunity landed in Meridiani Planum.';
    if (doI == 631)
	ThisSol = '';
    if (doI == 632)
	ThisSol = 'On this sol in 175: ERB Inc released "The Synthetic Men of Mars."\n\nOn this sol in 192: Mariner 9 frame 4205-78 imaged Pyramids of Elysium.';
    if (doI == 633)
	ThisSol = '';
    if (doI == 634)
	ThisSol = '';
    if (doI == 635)
	ThisSol = '';
    if (doI == 636)
	ThisSol = '';
    if (doI == 637)
	ThisSol = '';
    if (doI == 638)
	ThisSol = '';
    if (doI == 639)
	ThisSol = '';
    if (doI == 640)
	ThisSol = 'On this sol in 000: Galileo Galilei discovered that, like the Moon, Mars had a phase.';
    if (doI == 641)
	ThisSol = '';
    if (doI == 642)
	ThisSol = '';
    if (doI == 643)
	ThisSol = 'On this sol in 026: Christiaan Huygens drew the first sketch of Mars, including a dark, triangular area later named Syrtis Major, the first Martian surface feature identified from Earth. Huygens used his own design of telescope, which was of much higher quality than that of his predecessors and allowed a magnification of 50 times.';
    if (doI == 644)
	ThisSol = '';
    if (doI == 645)
	ThisSol = '';
    if (doI == 646)
	ThisSol = 'On this sol in 026: Christiaan Huygens noted, "The rotation of Mars, like that of the Earth, seems to have a period of 24 hours."\n\nOn this sol in 201: Phobos 1 passed Mars five months after contact was lost.';
    if (doI == 647)
	ThisSol = '';
    if (doI == 648)
	ThisSol = '';
    if (doI == 649)
	ThisSol = 'On this sol in 205: The National Science Foundation announced evidence for possible early life on Mars in Antarctic meteorite ALH84001.';
    if (doI == 650)
	ThisSol = 'On this sol in 201: Phobos 2 entered Mars orbit.';
    if (doI == 651)
	ThisSol = '';
    if (doI == 652)
	ThisSol = '';
    if (doI == 653)
	ThisSol = 'On this sol in 187: A meteorite fell near Zagami, Nigeria. In the 1980s, this meteorite was identified as having originated on Mars.';
    if (doI == 654)
	ThisSol = '';
    if (doI == 655)
	ThisSol = '';
    if (doI == 656)
	ThisSol = '';
    if (doI == 657)
	ThisSol = '';
    if (doI == 658)
	ThisSol = '';
    if (doI == 659)
	ThisSol = '';
    if (doI == 660)
	ThisSol = '';
    if (doI == 661)
	ThisSol = '';
    if (doI == 662)
	ThisSol = '';
    if (doI == 663)
	ThisSol = '';
    if (doI == 664)
	ThisSol = '';
    if (doI == 665)
	ThisSol = '';
    if (doI == 666)
	ThisSol = '';
    if (doI == 667)
	ThisSol = '';
    if (doI == 668)
	ThisSol = '';
    if (doI == 669)
	ThisSol = '';

    document.calc.DispThisSol.value = ThisSol;

    var OrbitPlot = parseInt(document.calc.InOrbitPlot.value, 10);

    if (OrbitPlot == 1)
    {
	// convert sols to Ls:
	MarsSolNum = doI + 1;
	// Sagittarius
	if (MarsSolNum > 0 && MarsSolNum <= 28)
		LsMars = 15 / 28 * MarsSolNum;
	// Dhanus
	if (MarsSolNum > 28 && MarsSolNum <= 56)
		LsMars = (29.5 - 15) / 28 * (MarsSolNum - 28) + 15;
	// Capricornus
	if (MarsSolNum > 56 && MarsSolNum <= 84)
		LsMars = (44.5 - 29.5) / 28 * (MarsSolNum - 56) + 29.5;
	// Makara
	if (MarsSolNum > 84 && MarsSolNum <= 112)
		LsMars = (58.5 - 44.5) / 28 * (MarsSolNum - 84) + 44.5;
	// Aquarius
	if (MarsSolNum > 112 && MarsSolNum <= 140)
		LsMars = (72 - 58.5) / 28 * (MarsSolNum - 112) + 58.5;
	// Kumbha
	if (MarsSolNum > 140 && MarsSolNum <= 167)
		LsMars = (85 - 72) / 27 * (MarsSolNum - 140) + 72;
	// Pisces
	if (MarsSolNum > 167 && MarsSolNum <= 195)
		LsMars = (97 - 85) / 28 * (MarsSolNum - 167) + 85;
	// Mina
	if (MarsSolNum > 195 && MarsSolNum <= 223)
		LsMars = (110.5 - 97) / 28 * (MarsSolNum - 195) + 97;
	// Aries
	if (MarsSolNum > 223 && MarsSolNum <= 251)
		LsMars = (124 - 110.5) / 28 * (MarsSolNum - 223) + 110.5;
	// Mesha
	if (MarsSolNum > 251 && MarsSolNum <= 279)
		LsMars = (139 - 124) / 28 * (MarsSolNum - 251) + 124;
	// Taurus
	if (MarsSolNum > 279 && MarsSolNum <= 307)
		LsMars = (154.5 - 139) / 28 * (MarsSolNum - 279) + 139;
	// Rishabha
	if (MarsSolNum > 307 && MarsSolNum <= 334)
		LsMars = (170 - 154.5) / 27 * (MarsSolNum - 307) + 154.5;
	// Gemini
	if (MarsSolNum > 334 && MarsSolNum <= 362)
		LsMars = (184.5 - 170) / 28 * (MarsSolNum - 334) + 170;
	// Mithuna
	if (MarsSolNum > 362 && MarsSolNum <= 390)
		LsMars = (200.5 - 184.5) / 28 * (MarsSolNum - 362) + 184.5;
	// Cancer
	if (MarsSolNum > 390 && MarsSolNum <= 418)
		LsMars = (216 - 200.5) / 28 * (MarsSolNum - 390) + 200.5;
	// Karka
	if (MarsSolNum > 418 && MarsSolNum <= 446)
		LsMars = (234 - 216) / 28 * (MarsSolNum - 418) + 216;
	// Leo
	if (MarsSolNum > 446 && MarsSolNum <= 474)
		LsMars = (248 - 234) / 28 * (MarsSolNum - 446) + 234;
	// Simha
	if (MarsSolNum > 474 && MarsSolNum <= 501)
		LsMars = (265 - 248) / 27 * (MarsSolNum - 474) + 248;
	// Virgo
	if (MarsSolNum > 501 && MarsSolNum <= 529)
		LsMars = (282.5 - 265) / 28 * (MarsSolNum - 501) + 265;
	// Kanya
	if (MarsSolNum > 529 && MarsSolNum <= 557)
		LsMars = (297.5 - 282.5) / 28 * (MarsSolNum - 529) + 282.5;
	// Libra
	if (MarsSolNum > 557 && MarsSolNum <= 585)
		LsMars = (312 - 297.5) / 28 * (MarsSolNum - 557) + 297.5;
	// Tula
	if (MarsSolNum > 585 && MarsSolNum <= 613)
		LsMars = (329 - 312) / 28 * (MarsSolNum - 585) + 312;
	// Scorpius
	if (MarsSolNum > 613 && MarsSolNum <= 641)
		LsMars = (345.5 - 329) / 28 * (MarsSolNum - 613) + 329;
	// Vrishika
	if (MarsSolNum > 641 && MarsSolNum <= 669)
		LsMars = (360 - 345.5) / 28 * (MarsSolNum - 641) + 345.5;

	obs = new Array(2);
	obs[2]=new Array (eval('ob'+2).style,-100,-100);

	obs[2][0].left= -Math.sin((LsMars - 9.5) * Math.PI / 180) * 166 + 4;
	obs[2][0].top= -Math.cos((LsMars - 9.5) * Math.PI / 180) * 177 - 240;
    }
}

function setEarthDateFromDays(daysSince)
{
    // get the fractional part, to do the time later
    partialDay = daysSince - Math.floor(daysSince);

    // Convert days to Gregorian date:

    var d = Math.floor(daysSince)+1;

    var sCD = Math.floor(d/146097);   // what 400 year span
    var doCD= Math.floor(d-(sCD*146097));

    var sC = 0;
    var doC = doCD;
    if(doCD != 0) sC = Math.floor((doCD-1)/36524);
    if(sC != 0) doC -= (sC*36524+1);

    var sIV = 0;
    var doIV = doC;
    if(sC != 0)  // 1460 + 1461*24
    {
      sIV = Math.floor((doC+1)/1461);
      if(sIV != 0) doIV -= (sIV*1461-1);
    }
    else  // 1461*25
    {
      sIV = Math.floor(doC/1461);
      if(sIV != 0) doIV -= (sIV*1461);
    }

    var sI = 0;
    var doI = doIV;
    if(sC != 0 && sIV == 0)  // four 365-day years in a row
    {
      sI = Math.floor(doIV/365);
      if(sI != 0) doI -= (sI*365);
    }
    else   // normal leap year cycle
    {
      if(doI != 0) sI = Math.floor((doIV-1)/365);
      if(sI != 0) doI -= (sI*365 + 1);
    }

    earthYear = 400*sCD + 100*sC + 4*sIV + sI;
    var tmpDayOfYear = doI+1;

    for(i=1; i<12; i++)
    {
        var tmpDaysInMonth = eDaysInMonth[i];
        if(i==2 && !isEarthLeapYear(earthYear))
            tmpDaysInMonth -= 1;

        if(tmpDayOfYear > tmpDaysInMonth)
            tmpDayOfYear -= tmpDaysInMonth;
        else
            break;
    }

    earthMonth = i;
    earthDay = tmpDayOfYear;

    if ((Math.floor(daysSince) + 1) % 7 == 1)
    	nDayName = "Sunday";
    if ((Math.floor(daysSince) + 1) % 7 == 2)
    	nDayName = "Monday";
    if ((Math.floor(daysSince) + 1) % 7 == 3)
    	nDayName = "Tuesday";
    if ((Math.floor(daysSince) + 1) % 7 == 4)
    	nDayName = "Wednesday";
    if ((Math.floor(daysSince) + 1) % 7 == 5)
    	nDayName = "Thursday";
    if ((Math.floor(daysSince) + 1) % 7 == 6)
    	nDayName = "Friday";
    if ((Math.floor(daysSince) + 1) % 7 == 0)
    	nDayName = "Saturday";

    // Put the result up:

    document.calc.eYear.value = earthYear;
    document.calc.eMonth.value = earthMonth;
    document.calc.eDay.value = twoDigit(earthDay);
    document.calc.eJulianDay.value = (Math.floor(daysSince*100000)/100000) + 1721060.5;
    document.calc.eNumDay.value = threeDigit(doI + 1);
    document.calc.eDayName.value = nDayName;

    var tmpHour = partialDay*24;
    var tmpMin  = (tmpHour - Math.floor(tmpHour))*60;
    var tmpSec  = (tmpMin - Math.floor(tmpMin))*60;
    document.calc.eHour.value = twoDigit(Math.floor(tmpHour));
    document.calc.eMin.value  = twoDigit(tmpMin);
    document.calc.eSec.value  = twoDigit(tmpSec);

	if (earthYear % 4 == 0 || (earthYear % 100 != 0 && earthYear % 400 == 0))
		LeapDay = 1;
	else
		LeapDay = 0;
	
    if (doI+1 == 1)
	ThisDay = 'On this day in 1898: H. G. Wells� "The War of the Worlds" was published as a novella (date approximate).\n\nOn this day in 1941: Edgar Rice Burroughs� "John Carter and the Giant of Mars" appeared in "Amazing Stories" (date approximate). The story was later included in the anthology "John Carter of Mars."';
    if (doI+1 == 2)
	ThisDay = 'On this day in 1920: Isaac Asimov was born, author of "The Martian Way."';
    if (doI+1 == 3)
	ThisDay = 'On this day in 1999: Mars Polar Lander was launched.';
    if (doI+1 == 4)
	ThisDay = 'On this day in 2004: Mars Exploration Rover Spirit landed in Gusev Crater. The spacecraft was later renamed the Columbia Memorial Station.';
    if (doI+1 == 5)
	ThisDay = '';
    if (doI+1 == 6)
	ThisDay = '';
    if (doI+1 == 7)
	ThisDay = 'On this day in 1921: Edgar Rice Burroughs began writing "The Chessmen of Mars."\n\nOn this day in 1939: Edgar Rice Burroughs� "The Synthetic Men of Mars" was published in "Argosy."';
    if (doI+1 == 8)
	ThisDay = '';
    if (doI+1 == 9)
	ThisDay = '';
    if (doI+1 == 10)
	ThisDay = '';
    if (doI+1 == 11)
	ThisDay = 'On this day in 2004: Two meteorites, designated Sayh al Uhaymir 130 and 131, were discovered near Dar al Sayh al Uhaymir, Oman. The meteorites were later identified as having originated on Mars.';
    if (doI+1 == 12)
	ThisDay = 'On this day in 1997: Marvin the Martian appeared in "The Springfield Files" episode of the animated television series "The Simpsons."';
    if (doI+1 == 13)
	ThisDay = 'On this day in 1907: In a letter to "The New York Times," Nikola Tesla declared, "I can easily bridge the gulf which separates us from Mars."\n\nOn this day in 1980: A meteorite, designated EETA 79001, was discovered in the Elephant Moraine, Antarctica. The meteorite was later identified as having originated on Mars.';
    if (doI+1 == 14)
	ThisDay = 'On this day in 1954: I. M. Levitt�s Earth-Mars Clock debuted in New York, New York.\n\nOn this day in 2004: US President George W. Bush announced plans to establish a lunar base to support human missions to Mars.';
    if (doI+1 == 15)
	ThisDay = 'On this day in 1905: "The New York Times" reported that Nikola Tesla might use an oscillator to "wake up" Mars.';
    if (doI+1 == 16)
	ThisDay = 'On this day in 1950: Japanese astronomer Sadao Saeki saw a huge explosion on Mars which produced a mushroom cloud 1450 km in diameter "like the terrific explosion of a volcano." No other people observed this explosion.';
    if (doI+1 == 17)
	ThisDay = '';
    if (doI+1 == 18)
	ThisDay = '';
    if (doI+1 == 19)
	ThisDay = 'On this day in 1882: Giovanni Schiaparelli recorded the first instance of gemination.  "Great was my astonishment on January 19, when, on examining the Jamuna... I saw instead of its usual appearance two straight and equal parallel lines running between the Niliacus Lacus and Aurorae Sinus. At first I believed this to be the deception of a tired eye, or perhaps the effect of some kind of strabismus, but I soon convinced myself that the phenomenon was real."\n\nOn this day in 2002: A meteorite, designated Sayh al Uhaymir 090, was discovered near Dar al Sayh al Uhaymir, Oman. The meteorite was later identified as having originated on Mars.';
    if (doI+1 == 20)
	ThisDay = '';
    if (doI+1 == 21)
	ThisDay = '';
    if (doI+1 == 22)
	ThisDay = '';
    if (doI+1 == 23)
	ThisDay = '';
    if (doI+1 == 24)
	ThisDay = 'On this day in 2000: A meteorite, designated Dhofar 019, was discovered near Dhofar, Oman. The meteorite was later identified as having originated on Mars.';
    if (doI+1 == 25)
	ThisDay = 'On this day in 1989: Phobos 1 passed Mars five months after contact was lost.\n\nOn this day in 2004: Mars Exploration Rover Opportunity landed in Meridiani Planum.';
    if (doI+1 == 26)
	ThisDay = '';
    if (doI+1 == 27)
	ThisDay = '';
    if (doI+1 == 28)
	ThisDay = '';
    if (doI+1 == 29)
	ThisDay = 'On this day in 1989: Phobos 2 entered Mars orbit.';
    if (doI+1 == 30)
	ThisDay = '';
    if (doI+1 == 31)
	ThisDay = '';
    if (doI+1 == 32)
	ThisDay = 'On this day in 1912: Edgar Rice Burroughs� "Under the Moons of Mars" began serialization in "All-Story," later was published as a novel under the title "A Princess of Mars" (date approximate).\n\nOn this day in 1943: Edgar Rice Burroughs� "The Skeleton Men of Jupiter" appeared in "Amazing Stories" (date approximate). Later included in the anthology "John Carter of Mars."\n\nOn this day in 1956: Robert A. Heinlein�s "Double Star" began serialization in "Astounding Science Fiction" (date approximate).';
    if (doI+1 == 33)
	ThisDay = 'On this day in 1896: In the first of a series of 40 seances, the spiritualist medium Catherine Elise Mueller communicated with Martians, speaking in their language, and in some seances, writing in Martian.';
    if (doI+1 == 34)
	ThisDay = '';
    if (doI+1 == 35)
	ThisDay = 'On this day in 1694: Christiaan Huygens drew his last sketch of Mars.';
    if (doI+1 == 36)
	ThisDay = '';
    if (doI+1 == 37)
	ThisDay = '';
    if (doI+1 == 38)
	ThisDay = '';
    if (doI+1 == 39)
	ThisDay = 'On this day in 1972: Mariner 9 frame 4205-78 imaged the Pyramids of Elysium.\n\nOn this day in 2000: A meteorite, designated GRV 9927, was discovered in the Grove Mountains, Antarctica. The meteorite was later identified as having originated on Mars.\n\nOn this day in 2001: A meteorite, designated Sayh al Uhaymir 094, was discovered near Sayh al Uhaymir, Oman. The meteorite was later identified as having originated on Mars.';
    if (doI+1 == 40)
	ThisDay = '';
    if (doI+1 == 41)
	ThisDay = 'On this day in 1974: Mars 4 failed to enter Mars orbit, passed Mars.';
    if (doI+1 == 42)
	ThisDay = '';
    if (doI+1 == 43)
	ThisDay = 'On this day in 1974: Mars 5 entered Mars orbit.\n\nOn this day in 1999: The motion picture "My Favorite Martian" was released in the USA.';
    if (doI+1 == 44)
	ThisDay = '';
    if (doI+1 == 45)
	ThisDay = '';
    if (doI+1 == 46)
	ThisDay = 'On this day in 1936: ERB Inc released "The Swords of Mars."\n\nOn this day in 1940: ERB Inc released "The Synthetic Men of Mars."';
    if (doI+1 == 47)
	ThisDay = '';
    if (doI+1 == 48)
	ThisDay = 'Quirinalia, sacred to Quirinus, celebrating the ascension of Romulus. Celebrated by the flamen Quirinalis. It is also known as the Feast of Fools.';
    if (doI+1 == 49)
	ThisDay = 'On this day in 1922: Edgar Rice Burroughs� "The Chessmen of Mars" began serialization in "Argosy All-Story Weekly."';
    if (doI+1 == 50)
	ThisDay = '';
    if (doI+1 == 51)
	ThisDay = '';
    if (doI+1 == 52)
	ThisDay = '';
    if (doI+1 == 53)
	ThisDay = '';
    if (doI+1 == 54)
	ThisDay = '';
    if (doI+1 == 55)
	ThisDay = '';
    if (doI+1 == 56)
	ThisDay = 'On this day in 1969: Mariner 6 was launched.';
    if (doI+1 == 57)
	ThisDay = 'On this day in 1842: Camille Flammarion was born, developed detailed maps of Mars and believed in an advanced civilization on that planet.';
    if (doI+1 == 58)
	ThisDay = 'Equirria, a festival of horse racing dedicated to Mars. Established by Romulus himself in the early days of Rome. It is held in the Campus Martius in Roma, or the Campus Martialis if the former is flooded. ';
    if (doI+1 == 59)
	ThisDay = 'On this day in 1928: Edgar Rice Burroughs began dictating "A Fighting Man of Mars" on Ediphone.';
    if (doI+1-LeapDay == 60)
	ThisDay = 'Feriae Marti, the original New Year�s Day on the Roman calendar. The Salii, a collegium divided into the Palatini (devoted to Mars Gradivus) and the Agonenses (devoted to Quirinus), dressed in archaic military armor and bearing the sacred shields, dance throughout the streets and chant the ancient Carme Saliare. After their dance, the Salii hold a spectacular feast.\n\nOn this day in 1941: Edgar Rice Burroughs� "The City of Mummies" appeared in "Amazing Stories" (date approximate). The story was later included in the anthology "Llana of Gathol."\n\nOn this day in 1973: Lin Carter�s "The Man Who Loved Mars" was published (date approximate).\n\nOn this day in 2001: Thomas W. Cronin�s "As it Is on Mars" was published.\n\nOn this day in 2003: Thomas W. Cronin�s "Give Us This Mars" was published.';
    if (doI+1-LeapDay == 61)
	ThisDay = '';
    if (doI+1-LeapDay == 62)
	ThisDay = '';
    if (doI+1-LeapDay == 63)
	ThisDay = '';
    if (doI+1-LeapDay == 64)
	ThisDay = '';
    if (doI+1-LeapDay == 65)
	ThisDay = '';
    if (doI+1-LeapDay == 66)
	ThisDay = '';
    if (doI+1-LeapDay == 67)
	ThisDay = '';
    if (doI+1-LeapDay == 68)
	ThisDay = 'Mars 7 passed Mars. Lander missed Mars.';
    if (doI+1-LeapDay == 69)
	ThisDay = '';
    if (doI+1-LeapDay == 70)
	ThisDay = '';
    if (doI+1-LeapDay == 71)
	ThisDay = 'On this day in 1974: Mars 6 passed Mars. Contact with the lander was lost before landing.';
    if (doI+1-LeapDay == 72)
	ThisDay = 'On this day in 1855: Percival Lowell was born, developed detailed maps of Mars and believed in an advanced Martian civilization.\n\nOn this day in 1992: US President George H. W. Bush issued National Space Policy Directive 6, "Space Exploration Initiative," calling for human expeditions to Mars.';
    if (doI+1-LeapDay == 73)
	ThisDay = 'Equirria, a festival of horse racing dedicated to Mars. Established by Romulus himself in the early days of Rome. It is held in the Campus Martius in Roma, or the Campus Martialis if the former is flooded. \n\nOn this day in 1834: Giovanni Schiaparelli was born, developed first detailed maps of Mars and originated the system of areographic nomenclature in use today.';
    if (doI+1-LeapDay == 74)
	ThisDay = '';
    if (doI+1-LeapDay == 75)
	ThisDay = '';
    if (doI+1-LeapDay == 76)
	ThisDay = 'Agonalia, a festival sacred to Mars.';
    if (doI+1-LeapDay == 77)
	ThisDay = '';
    if (doI+1-LeapDay == 78)
	ThisDay = 'Quinquatria, a celebration sacred to Mars, the first of five days. The Salii (priests of Mars) dance in the comitium (attended by the pontiffs and the symbolic representatives of the army--the tribuni celerum), and the sacred arma ancilia are purified. In this sense, it is a ritual preparation for the season�s coming military campaigns.';
    if (doI+1-LeapDay == 79)
	ThisDay = 'Quinquatria, a celebration sacred to Mars, the second of five days. The Salii (priests of Mars) dance in the comitium (attended by the pontiffs and the symbolic representatives of the army--the tribuni celerum), and the sacred arma ancilia are purified. In this sense, it is a ritual preparation for the season�s coming military campaigns.';
    if (doI+1-LeapDay == 80)
	ThisDay = 'Quinquatria, a celebration sacred to Mars, the third of five days. The Salii (priests of Mars) dance in the comitium (attended by the pontiffs and the symbolic representatives of the army--the tribuni celerum), and the sacred arma ancilia are purified. In this sense, it is a ritual preparation for the season�s coming military campaigns.';
    if (doI+1-LeapDay == 81)
	ThisDay = 'Quinquatria, a celebration sacred to Mars, the fourth of five days. The Salii (priests of Mars) dance in the comitium (attended by the pontiffs and the symbolic representatives of the army--the tribuni celerum), and the sacred arma ancilia are purified. In this sense, it is a ritual preparation for the season�s coming military campaigns.';
    if (doI+1-LeapDay == 82)
	ThisDay = 'Quinquatria, a celebration sacred to Mars, the last of five days. The Salii (priests of Mars) dance in the comitium (attended by the pontiffs and the symbolic representatives of the army--the tribuni celerum), and the sacred arma ancilia are purified. In this sense, it is a ritual preparation for the season�s coming military campaigns.\n\nTubilustrum, the lustration of trumpets, sacred to Mars. An ewe is sacrificed to sanctify the trumpets used in many of the public rites in preparation for both the coming sacral year and the military campaigning season. It is accompanied by a dance of the Salii.\n\nOn this day in 1912: Wernher von Braun was born, developed the Saturn V launch vehicle, author of "The Mars Project."';
    if (doI+1-LeapDay == 83)
	ThisDay = '';
    if (doI+1-LeapDay == 84)
	ThisDay = 'On this day in 1969: Mariner 7 was launched.';
    if (doI+1-LeapDay == 85)
	ThisDay = '';
    if (doI+1-LeapDay == 86)
	ThisDay = 'On this day in 1969: Mars 1969A failed during launch.\n\nOn this day in 1989: Contact with Phobos 2 was lost after 58 sols in Mars orbit.';
    if (doI+1-LeapDay == 87)
	ThisDay = 'On this day in 1938: Edgar Rice Burroughs began writing "The Synthetic Men of Mars."';
    if (doI+1-LeapDay == 88)
	ThisDay = '';
    if (doI+1-LeapDay == 89)
	ThisDay = '';
    if (doI+1-LeapDay == 90)
	ThisDay = '';
    if (doI+1-LeapDay == 91)
	ThisDay = 'On this day in 1897: H. G. Wells� "The War of the Worlds" began serialization in England in "Pearson�s" (date approximate).\n\nOn this day in 1930: Edgar Rice Burroughs� "A Fighting Man of Mars" began serialization in "Blue Book" (date approximate).\n\nOn this day in 1952: Leigh Brackett�s "The Last Days of Shandakor" appeared in "Startling Stories" (date approximate).\n\nOn this day in 1964: Philip K. Dick�s "Martian Time-Slip" was published (date approximate).';
    if (doI+1-LeapDay == 92)
	ThisDay = '';
    if (doI+1-LeapDay == 93)
	ThisDay = '';
    if (doI+1-LeapDay == 94)
	ThisDay = '';
    if (doI+1-LeapDay == 95)
	ThisDay = '';
    if (doI+1-LeapDay == 96)
	ThisDay = '';
    if (doI+1-LeapDay == 97)
	ThisDay = '';
    if (doI+1-LeapDay == 98)
	ThisDay = 'On this day in 1916: Edgar Rice Burroughs� "Thuvia, Maid of Mars" began serialization in "All-Story Weekly."';
    if (doI+1-LeapDay == 99)
	ThisDay = '';
   if (doI+1-LeapDay == 100)
	ThisDay = '';
    if (doI+1-LeapDay == 101)
	ThisDay = 'On this day in 1921: The motion picture "A Message from Mars" was released in the USA.';
    if (doI+1-LeapDay == 102)
	ThisDay = 'On this day in 1980: Contact with Viking Lander 2 was lost after 1,280 sols in Utopia Planitia.';
    if (doI+1-LeapDay == 103)
	ThisDay = '';
    if (doI+1-LeapDay == 104)
	ThisDay = 'On this day in 1629: Christiaan Huygens was born, drew the first identifiable Martian surface feature.\n\nOn this day in 1969: Mars 1969B failed during launch.';
    if (doI+1-LeapDay == 105)
	ThisDay = 'On this day in 1886: Henri Perrotin and Louis Thollon confirmed the existence of the "canali."';
    if (doI+1-LeapDay == 106)
	ThisDay = '';
    if (doI+1-LeapDay == 107)
	ThisDay = '';
    if (doI+1-LeapDay == 108)
	ThisDay = '';
    if (doI+1-LeapDay == 109)
	ThisDay = '';
    if (doI+1-LeapDay == 110)
	ThisDay = 'On this day in 1848: Kurd Lasswitz was born, author of "Two Planets."';
    if (doI+1-LeapDay == 111)
	ThisDay = '';
    if (doI+1-LeapDay == 112)
	ThisDay = '';
    if (doI+1-LeapDay == 113)
	ThisDay = '';
    if (doI+1-LeapDay == 114)
	ThisDay = '';
    if (doI+1-LeapDay == 115)
	ThisDay = 'On this day in 1997: "The Workshop on Early Mars" opened in Houston, Texas.';
    if (doI+1-LeapDay == 116)
	ThisDay = '';
    if (doI+1-LeapDay == 117)
	ThisDay = 'On this day in 1955: The motion picture "Devil Girl From Mars" was released in the USA.';
    if (doI+1-LeapDay == 118)
	ThisDay = '';
    if (doI+1-LeapDay == 119)
	ThisDay = 'On this day in 1981: "The Case For Mars I" conference opened in Boulder, Colorado.';
    if (doI+1-LeapDay == 120)
	ThisDay = '';
    if (doI+1-LeapDay == 121)
	ThisDay = 'On this day in 1897: H. G. Wells� "The War of the Worlds" began serialization in the USA in "Cosmopolitan" (date approximate).\n\nOn this day in 1950: Ray Bradbury�s "The Martian Chronicles" was published (date approximate).\n\nOn this day in 1963: The television series "My Favorite Martian" ended with the 107th episode.\n\nOn this day in 1998: A meteorite, designated Dar al Gani 476, was discovered near Dar al Gani, Libya. The meteorite was later identified as having originated on Mars.';
    if (doI+1-LeapDay == 122)
	ThisDay = '';
    if (doI+1-LeapDay == 123)
	ThisDay = 'On this day in 1990: Voicing his opposition to the Bush Administration�s Space Exploration Initiative, Senator Albert Gore, Jr. told his fellow legislators, "Before discussing a mission to Mars, the Administration needs a mission to reality."\n\nOn this day in 1991: "America at the Threshold: America�s Space Exploration Initiative" ("The Stafford Report") called for manned missions to Mars beginning in 2014.';
    if (doI+1-LeapDay == 124)
	ThisDay = '';
    if (doI+1-LeapDay == 125)
	ThisDay = '';
    if (doI+1-LeapDay == 126)
	ThisDay = 'On this day in 1915: Orson Welles was born, leader of the Mercury Theater of the Air, which performed the "Panic Broadcast."';
    if (doI+1-LeapDay == 127)
	ThisDay = 'On this day in 1856: Angelo Secchi described "a large, triangular patch." Then known as the Hourglass Sea, Secchi instead called it the "Canale Atlantico," the first use of the word "canale" applied to Mars. The feature was later named Syrtis Major by Giovanni Schiaparelli.\n\nOn this day in 1998: A meteorite, designated Dar al Gani 876, was discovered near Dar al Gani, Libya. The meteorite was later identified as having originated on Mars.';
    if (doI+1-LeapDay == 128)
	ThisDay = 'On this day in 1971: Mariner 8 failed during launch.';
    if (doI+1-LeapDay == 129)
	ThisDay = '';
    if (doI+1-LeapDay == 130)
	ThisDay = 'On this day in 1971: Kosmos 419 was launched, but failed to leave Earth orbit.';
    if (doI+1-LeapDay == 131)
	ThisDay = 'On this day in 1990: George H. W. Bush became the first US President to set a target date for sending humans to Mars: "I believe that before America celebrates the 50th anniversary of its landing on the Moon, the American flag should be planted on Mars."';
    if (doI+1-LeapDay == 132)
	ThisDay = '';
    if (doI+1-LeapDay == 133)
	ThisDay = 'On this day in 1907: The Martians launched the first of ten cylinders toward Earth, beginning the War of the Worlds.';
    if (doI+1-LeapDay == 134)
	ThisDay = 'On this day in 1907: During the War of the Worlds, the Martians launched the second of ten cylinders toward Earth.';
    if (doI+1-LeapDay == 135)
	ThisDay = 'On this day in 1907: During the War of the Worlds, the Martians launched the third of ten cylinders toward Earth.';
    if (doI+1-LeapDay == 136)
	ThisDay = 'On this day in 1907: During the War of the Worlds, the Martians launched the fourth of ten cylinders toward Earth.\n\nOn this day in 1992: Sailor Mars first appeared in "An Uncharmed Life" episode of the animated television series "Sailor Moon" (Japan air date).';
    if (doI+1-LeapDay == 137)
	ThisDay = 'On this day in 1907: During the War of the Worlds, the Martians launched the fifth of ten cylinders toward Earth.';
    if (doI+1-LeapDay == 138)
	ThisDay = 'On this day in 1907: During the War of the Worlds, the Martians launched the sixth of ten cylinders toward Earth.\n\nOn this day in 1988: Soviet President Mikhail Gorbachev called for a joint unmanned Mars mission with the USA.';
    if (doI+1-LeapDay == 139)
	ThisDay = 'On this day in 1907: During the War of the Worlds, the Martians launched the seventh of ten cylinders toward Earth.\n\nOn this day in 1971: Mars 2 was launched.';
    if (doI+1-LeapDay == 140)
	ThisDay = 'On this day in 1907: During the War of the Worlds, the Martians launched the eighth of ten cylinders toward Earth.';
    if (doI+1-LeapDay == 141)
	ThisDay = 'On this day in 1907: During the War of the Worlds, the Martians launched the nintn of ten cylinders toward Earth.';
    if (doI+1-LeapDay == 142)
	ThisDay = 'Tubilustrum, the lustration of trumpets, sacred to Mars. An ewe is sacrificed to sanctify the trumpets used in many of the public rites. It is accompanied by a dance of the Salii.\n\nOn this day in 1907: During the War of the Worlds, the Martians launched the last of ten cylinders toward Earth.';
    if (doI+1-LeapDay == 143)
	ThisDay = 'On this day in 1909: Nikola Tesla discussed communication with Mars in an article in "The New York Times."';
    if (doI+1-LeapDay == 144)
	ThisDay = '';
    if (doI+1-LeapDay == 145)
	ThisDay = '';
    if (doI+1-LeapDay == 146)
	ThisDay = 'On this day in 1988: The Planetary Society�s "Mars Declaration" was published in "The Washington Post."\n\nOn this day in 1993: "The Case For Mars V" conference opened in Boulder, Colorado.';
    if (doI+1-LeapDay == 147)
	ThisDay = '';
    if (doI+1-LeapDay == 148)
	ThisDay = 'On this day in 1971: Mars 3 was launched.';
    if (doI+1-LeapDay == 149)
	ThisDay = 'Ambarvalia, the ritual purification of the fields, connected with the agricultural deities Ceres, Bacchus, and Mars. It is the "beating of the bounds", when the boundaries between fields are purified by a procession of sacrificial animals, the suovetaurilia.';
    if (doI+1-LeapDay == 150)
	ThisDay = 'On this day in 1971: Mariner 9 was launched.';
    if (doI+1-LeapDay == 151)
	ThisDay = 'On this day in 1931: Edgar Rice Burroughs� "A Fighting Man of Mars" was published in "Metropolitan."';
    if (doI+1-LeapDay == 152)
	ThisDay = 'This day is sacred to Mars. It is the anniversary of the dedication of the Temple of Mars near the Capena gate.\n\nOn this day in 1894: The Lowell Observatory began its study of Mars. Eighteen months later, Percival Lowell was published the observations of the 1894 opposition in a popular book, "Mars."\n\nOn this day in 1941: Edgar Rice Burroughs� "The Black Pirates of Barsoom" appeared in "Amazing Stories" (date approximate). The story was later included in the anthology "Llana of Gathol."\n\nOn this day in 1990: The motion picture "Total Recall" was released in the USA.';
    if (doI+1-LeapDay == 153)
	ThisDay = 'On this day in 1895: "The San Francisco Chronicle" reported that an observer had read the name of the Almighty in Hebrew letters on the surface of Mars.\n\nOn this day in 2003: Mars Express was launched.';
    if (doI+1-LeapDay == 154)
	ThisDay = 'This day is sacred to Bellona.\n\nOn this day in 1963: The first "Symposium on the Exploration of Mars" opened in Denver, Colorado. This was the first conference devoted to the exploration of Mars via spacecraft.';
    if (doI+1-LeapDay == 155)
	ThisDay = 'On this day in 1990: "The Case For Mars IV" conference opened in Boulder, Colorado.';
    if (doI+1-LeapDay == 156)
	ThisDay = '';
    if (doI+1-LeapDay == 157)
	ThisDay = '';
    if (doI+1-LeapDay == 158)
	ThisDay = '';
    if (doI+1-LeapDay == 159)
	ThisDay = '';
    if (doI+1-LeapDay == 160)
	ThisDay = 'On this day in 1930: Lin Carter was born, author of "The Man Who Loved Mars."';
    if (doI+1-LeapDay == 161)
	ThisDay = 'On this day in 2003: Mars Exploration Rover Spirit was launched.';
    if (doI+1-LeapDay == 162)
	ThisDay = '';
    if (doI+1-LeapDay == 163)
	ThisDay = '';
    if (doI+1-LeapDay == 164)
	ThisDay = 'Minor Quinquatria, a festival sacred to Minerva and Mars.';
    if (doI+1-LeapDay == 165)
	ThisDay = 'On this day in 1907: The first Martian cylinder landed on Horsell Common, east of Horsell. The Deputation advanced upon the pit, waving a white flag. There was a flash of light, an invisible ray of heat flashed from man to man, and each burst into flame, killing about 40 people.';
    if (doI+1-LeapDay == 166)
	ThisDay = 'On this day in 1907: During the War of the Worlds, the second Martian cylinder landed on the Addlestone Golf Links. A battalion of the Cardigan Regiment rushed the Horsell pit in skirmish order and was annihilated by the Heat-Ray. The fighting-machine then destroyed Woking.';
    if (doI+1-LeapDay == 167)
	ThisDay = 'On this day in 1907: During the War of the Worlds, the third Martian cylinder landed north of Pyrford, completing the Surrey Triangle. Five Martian fighting-machines advanced down the Wey River to the confluence of the Thames. Royal Army batteries engage the Martians, destroying one fighting-machine, but Weybridge and Chertsey were destroyed by Heat-Ray. Later, the St. George�s Hill battery damaged one fighting-machine, but was then destroyed. Seven Martian fighting-machines fanned out along a curved line between St. George�s Hill, Weybridge, and the village of Send. The Martians discharged Black Smoke across the valley of the Thames, advancing through Street Cobham and Ditton. Richmond, Kingston, and Wimbledon were destroyed.';
    if (doI+1-LeapDay == 168)
	ThisDay = 'On this day in 1907: During the War of the Worlds, the fourth Martian cylinder landed in Bushey Park, beginning the West End Triangle. The Martians advanced in a line from Hanwell in the north to Coombe and Malden in the south. Organized resistance by the British forces collapsed. The Martians went to and fro over the North Downs between Guildford and Maidstone, using the Black Smoke to eliminate any artillery batteries located there. Police organization in London broke down. The railway system collapsed.\n\nOn this day in 2000: A meteorite, designated Dhofar 378, was discovered near Dhofar, Oman. The meteorite was later identified as having originated on Mars.';
    if (doI+1-LeapDay == 169)
	ThisDay = 'On this day in 1907: During the War of the Worlds, the fifth Martian cylinder landed in Sheen, and the sixth Martian cylinder landed in Wimbledon, completing the West End Triangle.';
    if (doI+1-LeapDay == 170)
	ThisDay = 'On this day in 1907: During the War of the Worlds, the seventh Martian cylinder landed in Primrose Hill, where the invaders established their new headquarters. "HMS Thunder Child" made a suicide run at three fighting-machines the mouth of the Blackwater to cover the escape of passenger vessels. Two fighting-machines were destroyed. "Thunder Child" was also destroyed. \n\nOn this day in 1963: Mars 1 passed Mars three months after contact was lost.\n\nOn this day in 1976: Viking 1 entered Mars orbit.\n\nOn this day in 1995: The "Mars Together" conference opened in Palo Alto, California.';
    if (doI+1-LeapDay == 171)
	ThisDay = 'On this day in 1907: During the War of the Worlds, the eighth Martian cylinder landed (unreported). A fighting-machine destroyed Leatherhead, with every soul in it.';
    if (doI+1-LeapDay == 172)
	ThisDay = 'On this day in 1907: During the War of the Worlds, the ninth Martian cylinder landed (unreported). The Martians vacated the Sheen cylinder except for one fighting-machine and one handling-machine.';
    if (doI+1-LeapDay == 173)
	ThisDay = 'On this day in 1907: During the War of the Worlds, the last of ten Martian cylinder landed (unreported).';
    if (doI+1-LeapDay == 174)
	ThisDay = '';
    if (doI+1-LeapDay == 175)
	ThisDay = '';
    if (doI+1-LeapDay == 176)
	ThisDay = '';
    if (doI+1-LeapDay == 177)
	ThisDay = '';
    if (doI+1-LeapDay == 178)
	ThisDay = 'On this day in 1941: Edgar Rice Burroughs� "The Black Pirates of Barsoom" was published in "Amazing Stories."\n\nOn this day in 2001: A meteorite, designated Sayh al Uhaymir 060, was discovered near Sayh al Uhaymir, Oman. The meteorite was later identified as having originated on Mars.';
    if (doI+1-LeapDay == 179)
	ThisDay = 'On this day in 1911: An unfortunate dog in Nakhla, Egypt was struck by part of a meteorite and killed. In the 1980s, the Nakhla meteorite was identified as having originated on Mars.';
    if (doI+1-LeapDay == 180)
	ThisDay = 'On this day in 2005: The motion picture "The War of the Worlds" was released in the USA.';
    if (doI+1-LeapDay == 181)
	ThisDay = '';
    if (doI+1-LeapDay == 182)
	ThisDay = 'On this day in 1911: Writing down his daydreams on the backs of old letterheads of previously failed businesses, Edgar Rice Burroughs used free time at his office to begin "A Princess of Mars" (date approximate).\n\nOn this day in 1997: William K. Hartmann�s "Mars Underground" was published (date approximate).';
    if (doI+1-LeapDay == 183)
	ThisDay = '';
    if (doI+1-LeapDay == 184)
	ThisDay = '';
    if (doI+1-LeapDay == 185)
	ThisDay = 'On this day in 1907: The last Martians succumbed to terrestrial disease, ending the War of the Worlds.\n\nOn this day in 1997: Mars Pathfinder landed in Ares Vallis. The spacecraft was later renamed the Carl Sagan Memorial Station.';
    if (doI+1-LeapDay == 186)
	ThisDay = '';
    if (doI+1-LeapDay == 187)
	ThisDay = 'On this day in 1997: Sojourner, the first roving vehicle on Mars, deployed from the Carl Sagan Memorial Station.';
    if (doI+1-LeapDay == 188)
	ThisDay = 'On this day in 1907: Robert A. Heinlein was born, author of "Red Planet," "Podkayne of Mars," and "Stranger in a Strange Land."\n\nOn this day in 1988: Phobos 1 was launched.';
    if (doI+1-LeapDay == 189)
	ThisDay = 'On this day in 2003: Mars Exploration Rover Opportunity was launched.';
    if (doI+1-LeapDay == 190)
	ThisDay = '';
    if (doI+1-LeapDay == 191)
	ThisDay = 'On this day in 1984: "The Case For Mars II" conference opened in Boulder, Colorado.';
    if (doI+1-LeapDay == 192)
	ThisDay = '';
    if (doI+1-LeapDay == 193)
	ThisDay = 'On this day in 1988: Phobos 2 was launched.';
    if (doI+1-LeapDay == 194)
	ThisDay = '';
    if (doI+1-LeapDay == 195)
	ThisDay = '';
    if (doI+1-LeapDay == 196)
	ThisDay = 'On this day in 1965: Mariner 4 achieved the first flyby of Mars, transmitted images of a cratered surface.';
    if (doI+1-LeapDay == 197)
	ThisDay = '';
    if (doI+1-LeapDay == 198)
	ThisDay = 'On this day in 1964: The motion picture "Robinson Crusoe on Mars" was released in the USA.\n\nOn this day in 1996: "The Case for Mars VI" conference opened in Boulder, Colorado.';
    if (doI+1-LeapDay == 199)
	ThisDay = 'On this day in 1958: A few months before it was transformed into a space agency by the National Aeronautics and Space Act, a report by the National Advisory Committee on Aeronautics projected that a manned Mars mission might be undertaken in 1977.\n\nOn this day in 1987: "The Case For Mars III" conference opened in Boulder, Colorado.';
    if (doI+1-LeapDay == 200)
	ThisDay = '';
    if (doI+1-LeapDay == 201)
	ThisDay = 'On this day in 1976: Viking Lander 1 achieved first successful landing on Mars in Chryse Planitia. The spacecraft was later renamed the Thomas A. Mutch Memorial Station.\n\nOn this day in 1989: US President H. W. George Bush launched the Space Exploration Initiative from the steps of the National Air & Space Museum on the 20th anniversary of the Apollo 11 moon landing, calling for "a journey into tomorrow, a journey to another planet - a manned mission to Mars."';
    if (doI+1-LeapDay == 202)
	ThisDay = 'On this day in 1973: Mars 4 was launched.\n\nOn this day in 1986: The "NASA Mars Conference" opened in Washington, DC.';
    if (doI+1-LeapDay == 203)
	ThisDay = '';
    if (doI+1-LeapDay == 204)
	ThisDay = 'On this day in 1914: Edgar Rice Burroughs began writing "The Gods of Mars."';
    if (doI+1-LeapDay == 205)
	ThisDay = 'On this day in 1940: Edgar Rice Burroughs began writing "John Carter and the Pits of Horz," first of a series for new book. The story was later was published under the title "The City of Mummies."\n\nOn this day in 1948: Marvin the Martian debuted in animated short film "Haredevil Hare."';
    if (doI+1-LeapDay == 206)
	ThisDay = 'On this day in 1973: Mars 5 was launched.\n\nOn this day in 1976: Viking Orbiter 1 frame 35A72 imaged Cydonia Face and Pyramids.\n\nOn this day in 1978: Contact with Viking Orbiter 2 was lost after 697 sols in Mars orbit.';
    if (doI+1-LeapDay == 207)
	ThisDay = '';
    if (doI+1-LeapDay == 208)
	ThisDay = 'On this day in 1781: William Herschel calculated a rotational period for Mars of 24 hours, 39 minutes, and 21.67 seconds. He also confirmed that the north polar spot was eccentric to the pole.';
    if (doI+1-LeapDay == 209)
	ThisDay = 'On this day in 1894: Nice Observatory astronomer Stephane Javelle observed a luminous projection in the region of the southern terminator of Mars.';
    if (doI+1-LeapDay == 210)
	ThisDay = '';
    if (doI+1-LeapDay == 211)
	ThisDay = 'On this day in 1894: Henri Joseph Anastase Perrotin, director of the Nice Observatory, sent the following telegram: "Projection lumineuse dans r�gion australe du terminateur de Mars observe� par Javelle 28 Juillet 16 heures Perrotin."';
    if (doI+1-LeapDay == 212)
	ThisDay = 'On this day in 1969: Mariner 6 passed Mars.';
    if (doI+1-LeapDay == 213)
	ThisDay = 'On this day in 1941: Edgar Rice Burroughs� "The Yellow Men of Mars" appeared in :Amazing Stories: (date approximate). The story was later included in the anthology "Llana of Gathol."\n\nOn this day in 1968: NASA terminated the contract to procure additional Saturn Vs, ending production with Saturn 515, and abandoning the heavy-lift launch capability required to launch piloted Mars missions.\n\nOn this day in 2000: A meteorite, designated Sayh al Uhaymir 051, was discovered near Sayh al Uhaymir, Oman. The meteorite was later identified as having originated on Mars.';
    if (doI+1-LeapDay == 214)
	ThisDay = 'On this day in 1894: The British scientific journal "Nature" reported the observation of Stephane Javelle.  "If we assume the light to be on the planet itself, then it must either have a physical or human origin; so it is expected that the old idea that the Martians are signalling to us will be revived."  H. G. Wells� narrator later speculated, "I am inclined to think that this blaze may have been the casting of the huge gun, in the vast pit sunk into their planet, from which their shots were fired at us."';
    if (doI+1-LeapDay == 215)
	ThisDay = 'On this day in 1945: The motion picture "The Purple Monster Strikes" was released in the USA.\n\nOn this day in 1967: NASA Manned Spacecraft Center issued "Request for Proposal No. BG721-28-7-528P, Planetary Surface Sample Return Probe Study for Manned Mars/Venus Reconnaissance/Retrieval Missions" in the 1975-1982 time frame. Rep. Joseph Karth, acting chairman of the House Subcommittee on NASA Oversight, who had been fighting an uphill battle to preserve Project Voyager funding, later expressed his exasperation, for the move cast the program of Saturn V-launched unmanned orbiters and landers in the role of a foot in the door for manned follow-on missions to the planets: "Very bluntly, a manned mission to Mars or Venus by 1975 or 1977 is now and always has been out of the question, and anyone who persists in this kind of misallocation of resources at this time will be stopped."';
    if (doI+1-LeapDay == 216)
	ThisDay = 'On this day in 1976: Viking Orbiter 1 frames 43A01 through 43A04 imaged Deuteronilus Crater Pyramid.';
    if (doI+1-LeapDay == 217)
	ThisDay = 'On this day in 1969: Mariner 7 passed Mars.\n\nOn this day in 1973: Mars 6 was launched.';
    if (doI+1-LeapDay == 218)
	ThisDay = 'On this day in 1965: Zond 2 passed Mars four months after contact was lost.\n\nOn this day in 1996: The National Science Foundation announced evidence for possible early life on Mars in Antarctic meteorite ALH84001.';
    if (doI+1-LeapDay == 219)
	ThisDay = 'On this day in 1976: Viking 2 entered Mars orbit.\n\nOn this day in 1980: Contact with Viking Orbiter 1 was lost after 1,469 sols in Mars orbit.';
    if (doI+1-LeapDay == 220)
	ThisDay = 'On this day in 2002: "The Fifth International Mars Society Convention" opened in Boulder, Colorado.';
    if (doI+1-LeapDay == 221)
	ThisDay = 'On this day in 1965: "I say let�s do it quickly and establish a foothold on a new planet while we still have one left to take off from." --Wernher von Braun, "Manned Mars Landing," "Aviation Week & Space Technology."\n\nOn this day in 1969: Members of the Charles Manson "family," a Martian nest patterned on Robert A. Heinlein�s "Stranger in a Strange Land," murdered actress Sharon Tate and four others in Los Angeles.\n\nOn this day in 1973: Mars 7 was launched.';
    if (doI+1-LeapDay == 222)
	ThisDay = 'On this day in 1877: Asaph Hall gave up a search for Martian moons. The following night, having resumed his search at the insistence of his wife, Angelina, he detected a faint object near Mars, which he later named Deimos.\n\nOn this day in 1969: Members of the Charles Manson "family," a Martian nest patterned on Robert A. Heinlein�s "Stranger in a Strange Land," murdered Leno and Rosemary LaBianca in Los Angeles.\n\nOn this day in 2000: "The Third International Mars Society Convention" opened in Toronto, Ontario.';
    if (doI+1-LeapDay == 223)
	ThisDay = 'On this day in 1989: "Mars is essentially in the same orbit. Mars is somewhat the same distance from the sun, which is very important. We have seen pictures where there are canals, we believe, and water. If there is water, that means there is oxygen. If oxygen, that means we can breathe." -- US Vice President Dan Quayle';
    if (doI+1-LeapDay == 224)
	ThisDay = 'On this day in 1877: "The New York Times" asked, "Is Mars inhabited?" in an editorial. As the best opposition since 1798 approached, questions in the popular mind came to the fore and the possibility of life on Mars was discussed in the press.\n\nOn this day in 1999: "The Second International Mars Society Convention" opened in Boulder, Colorado.';
    if (doI+1-LeapDay == 225)
	ThisDay = 'On this day in 1998: "The Founding Convention of the Mars Society" opened in Boulder, Colorado.';
    if (doI+1-LeapDay == 226)
	ThisDay = 'On this day in 2003: "The Sixth International Mars Society Convention" opened in Eugene, Oregon.';
    if (doI+1-LeapDay == 227)
	ThisDay = 'On this day in 1998: "The Founding Declaration of the Mars Society" was adopted unanimously in Boulder, Colorado.';
    if (doI+1-LeapDay == 228)
	ThisDay = 'On this day in 1967: U.S. Congress deleted funding for Voyager, a program of Saturn V-launched unmanned orbiters and landers, then scheduled for its first missions in 1973. The program was later down-scoped and renamed "Viking."';
    if (doI+1-LeapDay == 229)
	ThisDay = 'On this day in 1877: Asaph Hall discovered Phobos.';
    if (doI+1-LeapDay == 230)
	ThisDay = 'On this day in 1845: Omsby MacKnight Mitchel observed a white patch detached from the south polar cap of Mars. The feature became known as the Mountains of Mitchel. Actually it is a depression.\n\nOn this day in 1877: Asaph Hall announced the discovery of Mars� two moons. At the suggestion of Henry Madan, the Science Master of Eton, England, Hall named the moons Phobos and Deimos.';
    if (doI+1-LeapDay == 231)
	ThisDay = '';
    if (doI+1-LeapDay == 232)
	ThisDay = 'On this day in 1956: A dust storm began with a bright cloud over the Hellas-Noachis region that spread to engulf the whole planet by mid-September.\n\nOn this day in 1975: Viking 1 was launched.\n\nOn this day in 2004: "The Seventh International Mars Society Convention" opened in Chicago, Illinois.';
    if (doI+1-LeapDay == 233)
	ThisDay = 'On this day in 1907: I. M. Levitt was born, inventor of a Martian calendar and the first Earth-Mars mechanical date-time computer.\n\nOn this day in 1999: A meteorite, designated Dar al Gani 975, was discovered near Dar al Gani, Libya. The meteorite was later identified as having originated on Mars.';
    if (doI+1-LeapDay == 234)
	ThisDay = 'On this day in 1920: Ray Bradbury was born, author of "The Martian Chronicles."\n\nOn this day in 1993: Contact with Mars Observer was lost enroute to Mars.';
    if (doI+1-LeapDay == 235)
	ThisDay = 'On this day in 2001: "The Fourth International Mars Society Convention" opened at Stanford University, California.';
    if (doI+1-LeapDay == 236)
	ThisDay = 'On this day in 1638: Two years after making his first drawing of Mars, Neapolitan lawyer and amateur astronomer Francesco Fontana produced a second drawing, which like the first, featured a dark spot, which has been attributed to an optical defect in his telescope.';
    if (doI+1-LeapDay == 237)
	ThisDay = 'On this day in 1865: A meteorite fell near Shergotty, India. In the 1980s, the Shergotty meteorite was identified as having originated on Mars.\n\nOn this day in 1993: Mars Observer passed Mars three days after contact was lost.';
    if (doI+1-LeapDay == 238)
	ThisDay = 'On this day in 1953: The motion picture "The War of the Worlds" was released in the USA.';
    if (doI+1-LeapDay == 239)
	ThisDay = 'On this day in 1911: "Martians Build Two Immense Canals in Two Years" reported in "The New York Times."';
    if (doI+1-LeapDay == 240)
	ThisDay = 'On this day in 1877: Henry Draper of New York and Edward Singleton Holden of the U.S. Naval Observatory in Washington claimed to have jointly discovered the third moon at Draper�s private observatory at Hastings-on-the-Hudson. This discovery proved to be false; in fact, the proposed moon did not even obey Kepler�s laws.';
    if (doI+1-LeapDay == 241)
	ThisDay = '';
    if (doI+1-LeapDay == 242)
	ThisDay = 'On this day in 1976: Viking Orbiter 1 frame 70A13 imaged the Cydonia Face and Pyramids.';
    if (doI+1-LeapDay == 243)
	ThisDay = '';
    if (doI+1-LeapDay == 244)
	ThisDay = 'On this day in 1875: Edgar Rice Burroughs was born, author of the "Barsoom" series.\n\nOn this day in 1969: A NASA report to US President Richard Nixon�s Space Task Group, which was chartered to explore options for space efforts beyond the Apollo program, stated, "Manned expeditions to Mars could begin as early as 1981."\n\nOn this day in 1993: Sailor Mars first appeared in the manga "Run Run."';
    if (doI+1-LeapDay == 245)
	ThisDay = 'On this day in 1988: Contact with Phobos 1 was lost en route to Mars.';
    if (doI+1-LeapDay == 246)
	ThisDay = 'On this day in 1976: Viking Lander 2 landed in Utopia Planitia.';
    if (doI+1-LeapDay == 247)
	ThisDay = '';
    if (doI+1-LeapDay == 248)
	ThisDay = '';
    if (doI+1-LeapDay == 249)
	ThisDay = '';
    if (doI+1-LeapDay == 240)
	ThisDay = '';
    if (doI+1-LeapDay == 251)
	ThisDay = '';
    if (doI+1-LeapDay == 252)
	ThisDay = 'On this day in 1975: Viking 2 was launched.';
    if (doI+1-LeapDay == 253)
	ThisDay = '';
    if (doI+1-LeapDay == 254)
	ThisDay = '';
    if (doI+1-LeapDay == 255)
	ThisDay = 'On this day in 1877: Giovanni Schiaparelli began a detailed study of Mars for the purpose of drawing a new and accurate map of the planet.\n\nOn this day in 1997: Mars Global Surveyor entered Mars orbit.';
    if (doI+1-LeapDay == 256)
	ThisDay = '';
    if (doI+1-LeapDay == 257)
	ThisDay = '';
    if (doI+1-LeapDay == 258)
	ThisDay = 'On this day in 1877: Giovanni Schiaparelli observed the canale Cyclops.\n\nOn this day in 1969: The report by US President Richard Nixon�s Space Task Group, "The Post-Apollo Space Program: Directions for the Future," stated, "We conclude that NASA has the demonstrated organizational competence and technology base, by virtue of the Apollo success and other achievements, to carry out a successful program to land man on Mars within 15 years." Nevertheless, the report backed away from an early manned landing on Mars, recommending that the focus for the next decades in space should be on the development of hardware and systems that would ultimately support a manned mission to Mars at the close of the 20th century.';
    if (doI+1-LeapDay == 259)
	ThisDay = '';
    if (doI+1-LeapDay == 260)
	ThisDay = '';
    if (doI+1-LeapDay == 261)
	ThisDay = 'On this day in 1976: Viking Orbiter 1 frame 86A10 imaged the Utopia Faces.';
    if (doI+1-LeapDay == 262)
	ThisDay = 'On this day in 1995: Sailor Mars first appeared in "An Uncharmed Life" episode of the animated television series "Sailor Moon" (USA air date).\n\nOn this day in 1996: US President Bill Clinton abandoned George Bush�s goal of a manned landing on Mars. His National Science and Technology Council�s statement of National Space Policy only mentioned "a sustained program to support a robotic presence on the surface of Mars by year 2000 for the purposes of scientific research, exploration and technology development."';
    if (doI+1-LeapDay == 263)
	ThisDay = '';
    if (doI+1-LeapDay == 264)
	ThisDay = 'On this day in 1866: H. G. Wells was born, author of "The War of the Worlds."';
    if (doI+1-LeapDay == 265)
	ThisDay = 'On this day in 1877: Giovanni Schiaparelli observed the canale Ambrosia.';
    if (doI+1-LeapDay == 266)
	ThisDay = 'On this day in 1999: Two meteorites, designated Los Angeles 001 and 002, were discovered in the Mojave Desert near Los Angeles, California. The meteorites were later identified as having originated on Mars.';
    if (doI+1-LeapDay == 267)
	ThisDay = '';
    if (doI+1-LeapDay == 268)
	ThisDay = 'On this day in 1992: Mars Observer was launched.';
    if (doI+1-LeapDay == 269)
	ThisDay = '';
    if (doI+1-LeapDay == 270)
	ThisDay = 'On this day in 1919: Edgar Rice Burroughs� "The Warlord of Mars" was published by McClurg.\n\nOn this day in 1940: Edgar Rice Burroughs began writing "The Black Pirates of Barsoom," part 2 of a new Mars series.';
    if (doI+1-LeapDay == 271)
	ThisDay = '';
    if (doI+1-LeapDay == 272)
	ThisDay = 'On this day in 1963: The television series "My Favorite Martian" debuted.';
    if (doI+1-LeapDay == 273)
	ThisDay = '';
    if (doI+1-LeapDay == 274)
	ThisDay = 'On this day in 1783: William Herschel observed the south polar cap of Mars. "I am inclined to think that the white spot has some little revolution.... It is rather probable that the real pole, though within the spot, may lie near the circumference of it, or one-third of its diameter from one of the sides. A few days more will show it, as I shall now fix my particular attention on it."\n\nOn this day in 1895: "The observations of 1894 have made it practically certain that the so-called �canals� of Mars are real, whatever may be their explanation," Princeton astronomer Charles A. Young declared in his article for "Cosmopolitan," "Mr. Lowell�s Theory of Mars" (date approximate).';
    if (doI+1-LeapDay == 275)
	ThisDay = '';
    if (doI+1-LeapDay == 276)
	ThisDay = 'On this day in 1815: A meteorite fell near Chassigny, France. In the 1980s, the Chassigny meteorite was identified as having originated on Mars. It was the first Martian meteorite to be discovered.\n\nOn this day in 1913: Edgar Rice Burroughs drew a map of Barsoom at the request of his publisher.\n\nOn this day in 1962: A meteorite fell near Zagami, Nigeria. In the 1980s, this meteorite was identified as having originated on Mars.';
    if (doI+1-LeapDay == 277)
	ThisDay = 'On this day in 1877: Giovanni Schiaparelli observed the canali Ganges and Phison.';
    if (doI+1-LeapDay == 278)
	ThisDay = '';
    if (doI+1-LeapDay == 279)
	ThisDay = '';
    if (doI+1-LeapDay == 280)
	ThisDay = 'On this day in 1997: Contact with the Carl Sagan Memorial Station (Mars Pathfinder) was lost after 93 sols in Ares Vallis.';
    if (doI+1-LeapDay == 281)
	ThisDay = 'On this day in 1976: "Today we have touched Mars. There is life on Mars and it is us--extensions of our eyes in all directions, extensions of our mind, extensions of our heart and soul have touched Mars today. That�s the message to look for there: We are on Mars. We are the Martians!" --Ray Bradbury, speaking at "The Search for Life in the Solar System" symposium in Pasadena, California.\n\nOn this day in 2002: A meteorite, designated Sayh al Uhaymir 150, was discovered near Dar al Sayh al Uhaymir, Oman. The meteorite was later identified as having originated on Mars.';
    if (doI+1-LeapDay == 282)
	ThisDay = '';
    if (doI+1-LeapDay == 283)
	ThisDay = 'On this day in 1877: Giovanni Schiaparelli observed Mare Erythraeum and Noachis to be obscured by clouds.\n\nOn this day in 1917: Edgar Rice Burroughs� "A Princess of Mars" was published by McClurg.\n\nOn this day in 1960: Mars 1960A, the first known Mars mission, failed during launch.';
    if (doI+1-LeapDay == 284)
	ThisDay = '';
    if (doI+1-LeapDay == 285)
	ThisDay = '';
    if (doI+1-LeapDay == 286)
	ThisDay = '';
    if (doI+1-LeapDay == 287)
	ThisDay = 'On this day in 1960: Mars 1960B failed during launch.';
    if (doI+1-LeapDay == 288)
	ThisDay = 'Equus October, a cavalry exercise for the Roman army, a festival sacred to Mars.\n\nOn this day in 1829: Asaph Hall was born, discoverer of Phobos and Deimos.';
    if (doI+1-LeapDay == 289)
	ThisDay = '';
    if (doI+1-LeapDay == 290)
	ThisDay = '';
    if (doI+1-LeapDay == 291)
	ThisDay = 'On this day in 1896: Charles A. Young of Princeton University discussed the question "Is Mars Inhabited?" in the "Boston Herald."';
    if (doI+1-LeapDay == 292)
	ThisDay = 'Armilustrum, the lustration of shields, a festival sacred to Mars.';
    if (doI+1-LeapDay == 293)
	ThisDay = 'On this day in 1877: Giovanni Schiaparelli observed the canale Eunostos.';
    if (doI+1-LeapDay == 294)
	ThisDay = '';
    if (doI+1-LeapDay == 295)
	ThisDay = '';
    if (doI+1-LeapDay == 296)
	ThisDay = 'On this day in 2001: Mars Odyssey entered Mars orbit.';
    if (doI+1-LeapDay == 297)
	ThisDay = 'On this day in 1940: Edgar Rice Burroughs began writing "Escape on Mars," part 3 of a new Mars series. The story was later was published under the title "The Yellow Men of Mars."\n\nOn this day in 1962: Mars 1962A (Sputnik 29) was launched, but failed to leave Earth orbit.';
    if (doI+1-LeapDay == 298)
	ThisDay = 'On this day in 1941: Edgar Rice Burroughs began writing "The Skeleton Men of Jupiter," the first of a planned new John Carter series.';
    if (doI+1-LeapDay == 299)
	ThisDay = '';
    if (doI+1-LeapDay == 300)
	ThisDay = 'On this day in 1879: Discussing the canali in a letter to Nathaniel Green, Giovanni Schiaparelli declared, "It is [as] impossible to doubt their existence as that of the Rhine on the surface of the Earth."\n\nOn this day in 1972: Contact with Mariner 9 was lost after 338 sols in Mars orbit.';
    if (doI+1-LeapDay == 301)
	ThisDay = '';
    if (doI+1-LeapDay == 302)
	ThisDay = '';
    if (doI+1-LeapDay == 303)
	ThisDay = 'On this day in 1938: The Mercury Theater of the Air, starring Orson Welles, performed Howard Koch�s radio play "Invasion from Mars." The broadcast terrorized the eastern USA.';
    if (doI+1-LeapDay == 304)
	ThisDay = '';
    if (doI+1-LeapDay == 305)
	ThisDay = 'On this day in 1934: Edgar Rice Burroughs� "The Swords of Mars" began serialization in "Blue Book" (date approximate).\n\nOn this day in 1952: Isaac Asimov�s "The Martian Way" appeared in "Galaxy Science Fiction" (date approximate).\n\nOn this day in 1955: Fredric Brown�s "Martians, Go Home" was published (date approximate).\n\nOn this day in 1957: Isaac Asimov�s "I�m in Marsport without Hilda" appeared in "Venture Science Fiction" (date approximate).\n\nOn this day in 1962: Mars 1 was launched. Robert A. Heinlein�s "Podkayne of Mars" began serialization in "If" (date approximate).';
    if (doI+1-LeapDay == 306)
	ThisDay = '';
    if (doI+1-LeapDay == 307)
	ThisDay = '';
    if (doI+1-LeapDay == 308)
	ThisDay = 'On this day in 1962: Mars 1962B (Sputnik 31) was launched, but failed to leave Earth orbit.';
    if (doI+1-LeapDay == 309)
	ThisDay = 'On this day in 1964: Mariner 3 failed during launch.';
    if (doI+1-LeapDay == 310)
	ThisDay = '';
    if (doI+1-LeapDay == 311)
	ThisDay = 'On this day in 1938: The motion picture "Mars Attacks the World" was released in the USA.\n\nOn this day in 1996: Mars Global Surveyor was launched.';
    if (doI+1-LeapDay == 312)
	ThisDay = '';
    if (doI+1-LeapDay == 313)
	ThisDay = 'On this day in 1934: Carl Sagan was born, first president of the Planetary Society.';
    if (doI+1-LeapDay == 314)
	ThisDay = 'On this day in 1879: Giovanni Schiaparelli discovered a small white patch in Tharsis and named it Nix Olympica. Nearly a century later, Mariner 9 imagery revealed this feature to be the largest mountain in the Solar System, and the feature was renamed Olympus Mons.\n\nOn this day in 1911: Percival Lowell reported "Frost on Mars" to "The New York Times."';
    if (doI+1-LeapDay == 315)
	ThisDay = 'On this day in 1875: Earl C. Slipher was born, observed Mars extensively.\n\nOn this day in 1951: The motion picture "Flight to Mars" was released in the USA.';
    if (doI+1-LeapDay == 316)
	ThisDay = '';
    if (doI+1-LeapDay == 317)
	ThisDay = 'On this day in 1982: Contact with the Thomas A. Mutch Memorial Station (Viking Lander 1) was lost after 2,244 sols in Chryse Planitia.';
    if (doI+1-LeapDay == 318)
	ThisDay = 'On this day in 1971: Mariner 9 became the first spacecraft to orbit Mars.';
    if (doI+1-LeapDay == 319)
	ThisDay = 'On this day in 1996: The motion picture "Space Jam" starring Marvin the Martian was released.';
    if (doI+1-LeapDay == 320)
	ThisDay = 'On this day in 1996: Mars 96 failed during launch.';
    if (doI+1-LeapDay == 321)
	ThisDay = 'On this day in 1996: The third annual "Lunar and Mars Exploration" conference was held in San Diego, California.\n\nOn this day in 2002: A meteorite, designated Sayh al Uhaymir 120, was discovered near Dar al Sayh al Uhaymir, Oman. The meteorite was later identified as having originated on Mars.';
    if (doI+1-LeapDay == 322)
	ThisDay = 'On this day in 1940: Edgar Rice Burroughs began writing "The Invisible Men of Mars," part 4 of a new Mars series.';
    if (doI+1-LeapDay == 323)
	ThisDay = 'On this day in 2003: A meteorite, designated Sayh al Uhaymir 125, was discovered near Dar al Sayh al Uhaymir, Oman. The meteorite was later identified as having originated on Mars.';
    if (doI+1-LeapDay == 324)
	ThisDay = 'On this day in 1989: NASA�s "Report of the 90-Day Study on Human Exploration of the Moon and Mars" estimated the cost of a manned Mars program at $450 billion. Political support for manned Mars missions subsequently collapsed.';
    if (doI+1-LeapDay == 325)
	ThisDay = '';
    if (doI+1-LeapDay == 325)
	ThisDay = '';
    if (doI+1-LeapDay == 326)
	ThisDay = '';
    if (doI+1-LeapDay == 327)
	ThisDay = '';
    if (doI+1-LeapDay == 328)
	ThisDay = '';
    if (doI+1-LeapDay == 329)
	ThisDay = '';
    if (doI+1-LeapDay == 330)
	ThisDay = 'On this day in 1999: Two meteorites, designated Sayh al Uhaymir 005 and 008, were discovered near Sayh al Uhaymir, Oman. The meteorites were later identified as having originated on Mars.';
    if (doI+1-LeapDay == 331)
	ThisDay = 'On this day in 1971: Mariner 9 returned the first image of Deimos. Mars 2 Orbiter entered Mars orbit. Mars 2 Lander impacted on Mars.';
    if (doI+1-LeapDay == 332)
	ThisDay = 'On this day in 1659: Christiaan Huygens drew the first sketch of Mars, including a dark, triangular area later named Syrtis Major, the first Martian surface feature identified from Earth. Huygens used his own design of telescope, which was of much higher quality than that of his predecessors and allowed a magnification of 50 times.\n\nOn this day in 1964: Mariner 4 was launched.';
    if (doI+1-LeapDay == 333)
	ThisDay = 'On this day in 1922: Edgar Rice Burroughs� "The Chessmen of Mars" was published by McClurg.\n\nOn this day in 2000: A meteorite, designated Y000593, was discovered in the Yamato Mountains, Antarctica. The meteorite was later identified as having originated on Mars.';
    if (doI+1-LeapDay == 334)
	ThisDay = 'On this day in 1964: Zond 2 was launched.\n\nOn this day in 1971: Mariner 9 returned the first image of Phobos.';
    if (doI+1-LeapDay == 335)
	ThisDay = 'On this day in 1659: Christiaan Huygens noted, "The rotation of Mars, like that of the Earth, seems to have a period of 24 hours."\n\nOn this day in 1895: Percival Lowell�s "Mars" was published (date approximate).\n\nOn this day in 1913: Edgar Rice Burroughs� "The Warlord of Mars" began serialization in "All-Story" (date approximate).';
    if (doI+1-LeapDay == 336)
	ThisDay = 'On this day in 1971: Mars 3 Orbiter entered Mars orbit. Contact with Mars 2 Lander was lost shortly after landing. No useful data was returned.';
    if (doI+1-LeapDay == 337)
	ThisDay = 'On this day in 1999: Contact with Mars Polar Lander was lost prior to landing on Mars.\n\nOn this day in 2000: A meteorite, designated Y000749, was discovered in the Yamato Mountains, Antarctica. The meteorite was later identified as having originated on Mars.';
    if (doI+1-LeapDay == 338)
	ThisDay = 'On this day in 1996: Mars Pathfinder was launched.';
    if (doI+1-LeapDay == 339)
	ThisDay = '';
    if (doI+1-LeapDay == 340)
	ThisDay = '';
    if (doI+1-LeapDay == 341)
	ThisDay = 'On this day in 1915: Leigh Brackett was born, author of the Eric John Stark series of Martian stories.\n\nOn this day in 1988: Soviet President Mikhail Gorbachev called for a joint manned Mars mission with the USA.';
    if (doI+1-LeapDay == 342)
	ThisDay = '';
    if (doI+1-LeapDay == 343)
	ThisDay = '';
    if (doI+1-LeapDay == 344)
	ThisDay = '';
    if (doI+1-LeapDay == 345)
	ThisDay = 'On this day in 1998: Mars Climate Orbiter was launched.';
    if (doI+1-LeapDay == 346)
	ThisDay = '';
    if (doI+1-LeapDay == 347)
	ThisDay = 'On this day in 1996: The motion picture "Mars Attacks!" was released in the USA.';
    if (doI+1-LeapDay == 348)
	ThisDay = '';
    if (doI+1-LeapDay == 349)
	ThisDay = 'On this day in 2003: A meteorite, designated MIL 03346, was discovered in the Miller Range of the Transantarctic Mountains. The meteorite was later identified as having originated on Mars.';
    if (doI+1-LeapDay == 350)
	ThisDay = 'On this day in 1917: Arthur C. Clarke was born, author of "The Sands of Mars."\n\nOn this day in 1928: Philip K. Dick was born, author of "Martian Time-Slip."\n\nOn this day in 1994: A meteorite, designated QUE 94201, was discovered in the Queen Alexandra Range, Antarctica. The meteorite was later identified as having originated on Mars.';
    if (doI+1-LeapDay == 351)
	ThisDay = '';
    if (doI+1-LeapDay == 352)
	ThisDay = '';
    if (doI+1-LeapDay == 353)
	ThisDay = '';
    if (doI+1-LeapDay == 354)
	ThisDay = '';
    if (doI+1-LeapDay == 355)
	ThisDay = '';
    if (doI+1-LeapDay == 356)
	ThisDay = 'On this day in 1988: A meteorite, designated LEW 88516, was discovered at Lewis Cliff, Antarctica. The meteorite was later identified as having originated on Mars.';
    if (doI+1-LeapDay == 357)
	ThisDay = '';
    if (doI+1-LeapDay == 358)
	ThisDay = 'On this day in 1644: Two patches on the lower part of the disk of Mars were described by a Neapolitan Jesuit named Father Bartoli.';
    if (doI+1-LeapDay == 359)
	ThisDay = 'On this day in 2003: Mars Express entered orbit. Contact with Beagle 2 was lost prior to landing in Isidis Planitia.';
    if (doI+1-LeapDay == 360)
	ThisDay = 'On this day in 1957: The motion picture "Mars and Beyond" was released in the USA.';
    if (doI+1-LeapDay == 361)
	ThisDay = 'On this day in 1984: A meteorite, designated ALH 84001, was discovered in the Allan Hills, Antarctica. In 1993, the meteorite was identified as having originated on Mars. In 1996, a team of scientists announced evidence on fossilized Martian life in the meteorite.';
    if (doI+1-LeapDay == 362)
	ThisDay = '';
    if (doI+1-LeapDay == 363)
	ThisDay = 'On this day in 1930: The motion picture "Mars" was released in the USA.\n\nOn this day in 1977: A meteorite, designated ALHA 77005, was discovered in the Allan Hills, Antarctica. In the 1980s, the meteorite was identified as having originated on Mars.';
    if (doI+1-LeapDay == 364)
	ThisDay = 'On this day in 1610: Galileo Galilei discovered that, like the Moon, Mars had a phase.';
    if (doI+1-LeapDay == 365)
	ThisDay = 'On this day in 1864: Robert G. Aitken was born, developed the first complete Martian calendar.';

    document.calc.DispThisDay.value = ThisDay;

    var OrbitPlot = parseInt(document.calc.InOrbitPlot.value, 10);

    if (OrbitPlot == 1)
    {
	if (earthYear % 4 == 0)
		LeapDay = 1;
	else
		LeapDay = 0;
	
	if (earthMonth == 1)
		EarthDayNum = earthDay;
	if (earthMonth == 2)
		EarthDayNum = earthDay + 31;
	if (earthMonth == 3)
		EarthDayNum = earthDay + 59 + LeapDay;
	if (earthMonth == 4)
		EarthDayNum = earthDay + 90 + LeapDay;
	if (earthMonth == 5)
		EarthDayNum = earthDay + 120 + LeapDay;
	if (earthMonth == 6)
		EarthDayNum = earthDay + 151 + LeapDay;
	if (earthMonth == 7)
		EarthDayNum = earthDay + 181 + LeapDay;
	if (earthMonth == 8)
		EarthDayNum = earthDay + 212 + LeapDay;
	if (earthMonth == 9)
		EarthDayNum = earthDay + 243 + LeapDay;
	if (earthMonth == 10)
		EarthDayNum = earthDay + 273 + LeapDay;
	if (earthMonth == 11)
		EarthDayNum = earthDay + 304 + LeapDay;
	if (earthMonth == 12)
		EarthDayNum = earthDay + 334 + LeapDay;

	LsEarth= (EarthDayNum - 83) * 360/365;

	obs = new Array(2);
	obs[1]=new Array (eval('ob'+1).style,-100,-100);

	obs[1][0].left= -Math.cos(LsEarth * Math.PI / 180) * 108 + 17;
	obs[1][0].top= Math.sin(LsEarth * Math.PI / 180) * 116 - 209;
    }
}


function convEarthToMars()
{
    var daysSince, solsSince, partialSol;
    var marsYear, marsMonth, marsDay;

    // Range checking:

    if(document.calc.eYear.value < 0)
    {
        alert("Warning: Dates before the year 1 are not handled exactly by this applet.");
    }
    else if(document.calc.eYear.value < 1582)
    {
        alert("Warning: Gregorian calendar did not exist in the year specified.");
    }
    else if(document.calc.eYear.value < 1753)
    {
        alert("Warning: The British Empire did not adopt the Gregorian calendar until 1752.");
    }

    if(document.calc.eMonth.value < 1
     || document.calc.eMonth.value > 12)
    {
        alert("There are not that many months on Earth.");
        return;
    }

    if(document.calc.eDay.value < 1
     || document.calc.eDay.value > eDaysInMonth[document.calc.eMonth.value]
     || (!isEarthLeapYear(document.calc.eYear.value)
       && document.calc.eMonth.value==2
       && document.calc.eDay.value > 28))
    {
        alert("There are not that many days in this month on Earth.");
        return;
    }

    // Convert to straight days:

    daysSince = getEarthDaysFromForm();

    if(document.calc.eTZ.options[document.calc.eTZ.selectedIndex].text == "Local")
      daysSince += (new Date()).getTimezoneOffset()/1440;
    else
      daysSince +=
        document.calc.eTZ.options[document.calc.eTZ.selectedIndex].value/1440;

    // Convert days to sols:

    solsSince = (daysSince - EPOCH_OFFSET) / MARS_TO_EARTH_DAYS;

    solsSince +=
      document.calc.mTZ.options[document.calc.mTZ.selectedIndex].value/360;

    // Convert back to date, and put it it form:
    setMarsDateFromSols(solsSince);
    setEarthDateFromDays(daysSince);
}

function convMarsToEarth()
{
    var solsSince, daysSince, partialDay;
    var eYear, eMonth, eDay;

    // Range checking:
    if(document.calc.mMonth.value < 1
     || document.calc.mMonth.value > 24)
    {
        alert("There are not that many months on Mars.");
        return;
    }

    if(document.calc.mDay.value < 1
     || document.calc.mDay.value > 28
     || (document.calc.mMonth.value % 6 == 0
       && document.calc.mDay.value == 28
       && !(document.calc.mMonth.value == 24
         && isMartianLeapYear(document.calc.mYear.value))))
    {
        alert("There are not that many days in this month on Mars.");
        return;
    }

    // Convert Martian date to sols:

    solsSince = getMarsSolsFromForm();

    solsSince -=
      document.calc.mTZ.options[document.calc.mTZ.selectedIndex].value/360;

    // Convert sols to days:

    daysSince = solsSince*MARS_TO_EARTH_DAYS + EPOCH_OFFSET
      + ROUND_UP_SECOND;

    if(document.calc.eTZ.options[document.calc.eTZ.selectedIndex].text == "Local")
      daysSince -= (new Date()).getTimezoneOffset()/1440;
    else
      daysSince -=
        document.calc.eTZ.options[document.calc.eTZ.selectedIndex].value/1440;

    // Convert back to date, and put it it form:
    setEarthDateFromDays(daysSince);
    setMarsDateFromSols(solsSince);
}

function daysInEarthYear(year)
{
    if(isEarthLeapYear(year)) return 366;
    else return 365;
}

function isEarthLeapYear(year)
{
    if((year % 400) == 0) return true;
    if((year % 100) == 0) return false;
    if((year %   4) == 0) return true;
    return false;
}

function getMartianSeasonFromSol(sol)
  {
    if(sol < 167) return 0;
    if(sol < 334) return 1;
    if(sol < 501) return 2;
    return 3;
  }

function daysInMartianYear(year)
{
    if(isMartianLeapYear(year)) return 669;
    else return 668;
}

function isMartianLeapYear(year)
{
    if((year % 500) == 0) return true;
    if((year % 100) == 0) return false;
    if((year %  10) == 0) return true;
    if((year %   2) == 0) return false;
    return true;
}

function twoDigit(n)
{
  if(n<10) return "0"+Math.floor(n);
  else return Math.floor(n);
}

function threeDigit(n)
{
	if (n < 0)
		return "-" + PadLeft(-n, 3, "0");
	else
		return PadLeft(n, 3, "0");
}

// functions to add characters to start of a string until desired length reached:
function PadLeft(value, width, chPad)
{
	// convert to a string:
	var result = value + "";
	// add pad characters until desired width is reached:
	while (result.length < width)
		result = chPad + result;
	return result;
}

function insertNow()
{
    d = new Date();

    document.calc.eYear.value = d.getUTCFullYear();
    document.calc.eMonth.value= d.getUTCMonth() + 1;
    document.calc.eDay.value  = twoDigit(d.getUTCDate());
    document.calc.eHour.value = d.getUTCHours();
    document.calc.eMin.value  = twoDigit(d.getMinutes());
    document.calc.eSec.value  = twoDigit(d.getSeconds());
    document.calc.eTZ.selectedIndex = 0;    // set Time Zone to local

    convEarthToMars();
}

