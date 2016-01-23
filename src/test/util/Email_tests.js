/*
* Copyright © 2008-2011, Dominic Sayers
* Test schema documentation Copyright © 2011, Daniel Marschall
* All rights reserved.
*
* Redistribution and use in source and binary forms, with or without modification,
* are permitted provided that the following conditions are met:
*
*     - Redistributions of source code must retain the above copyright notice,
*       this list of conditions and the following disclaimer.
*     - Redistributions in binary form must reproduce the above copyright notice,
*       this list of conditions and the following disclaimer in the documentation
*       and/or other materials provided with the distribution.
*     - Neither the name of Dominic Sayers nor the names of its contributors may be
*       used to endorse or promote products derived from this software without
*       specific prior written permission.
*
* THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND
* ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED
* WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
* DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE FOR
* ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES
* (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;
* LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON
* ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
* (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS
* SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
-->
<!--
Notes
.....
 1. To test email addresses that include ASCII control characters (ASCII
    positions < 32), put a Unicode entity in this data. This is because XML
    doesn't like storing &#x00;. The Unicode entity you should use
    is &#x2400; + the ASCII position. E.g to test a BEL character (ASCII
    position 7), put a &#x2407; in this data. This also enables the control
    characters to be made visible in your output because the Unicode characters
    &#x2400; onwards are 'SYMBOL FOR xxx'. In other words &#x2407; will look
    like BEL in your output.

 2. Certain outcomes are impossible to test since they imply another, higher
    order, outcome also. These are:

    ISEMAIL_RFC5322_DOMLIT_OBSDTEXT
    This implies that the domain literal cannot be a valid RFC 5321 address
    literal. This issue outranks the fact that the token is also obs-dtext.

If you update these tests, don\'t forget to change the actual version number
attribute in the <tests> element below!

Date       Tests        Version Notes
.......... ............ ....... ...............................................
2010-10-18 #1-#279      3.0	New schema designed to enhance fault
				identification.
2011-05-23 #32		3.02	Changed domain to c dash dash n.com because
				g dash dash a.com no longer has an MX record.
2011-07-14 All		3.04	Changed my link to http://isemail.info

2016-01-01 All  3.04     Converted to json data format
*/


var com_github_dominicsayers_isemail = {
	
	description: {
		title: 'New test set',
		text: 'This test set is designed to replace and extend the coverage of the original set but with fewer tests. Thanks to Michael Rushton (michael@squiloople.com) for starting this work and contributing tests 1-100'
	},
	
	categories: function() { // parse categories
	
		var tests = com_github_dominicsayers_isemail.tests, ret = [];
		
		for (var test in tests) {
			
			if (ret.indexOf(tests[test].category) === -1) {
				
				ret.push(tests[test].category);
			}
		}
		
		return ret.sort();
	},
	
	diagnoses: function() { // parse diagnoses
	
		var tests = com_github_dominicsayers_isemail.tests, ret = [];
		
		for (var test in tests) {
			
			if (ret.indexOf(tests[test].diagnosis) === -1) {
				
				ret.push(tests[test].diagnosis);
			}
		}
		
		return ret.sort();
	},
	
	tests: {
		1: {
			address: '',
			category: 'ISEMAIL_ERR',
			diagnosis: 'ISEMAIL_ERR_NODOMAIN',
			source: 'Michael Rushton',
			sourcelink: 'http://squiloople.com/tag/email/',
		},
		2: {
			address: 'test',
			category: 'ISEMAIL_ERR',
			diagnosis: 'ISEMAIL_ERR_NODOMAIN',
			source: 'Michael Rushton',
			sourcelink: 'http://squiloople.com/tag/email/',
		},
		3: {
			address: '@',
			category: 'ISEMAIL_ERR',
			diagnosis: 'ISEMAIL_ERR_NOLOCALPART',
			source: 'Michael Rushton',
			sourcelink: 'http://squiloople.com/tag/email/',
		},
		4: {
			address: 'test@',
			category: 'ISEMAIL_ERR',
			diagnosis: 'ISEMAIL_ERR_NODOMAIN',
			source: 'Michael Rushton',
			sourcelink: 'http://squiloople.com/tag/email/',
		},
		5: {
			address: 'test@io',
			comment: 'io. currently has an MX-record (Feb 2011). Some DNS setups seem to find it, some don\'t. If you don\'t see the MX for io. then try setting your DNS server to 8.8.8.8 (the Google DNS server)',
			category: 'ISEMAIL_VALID_CATEGORY',
			diagnosis: 'ISEMAIL_VALID',
			source: 'Michael Rushton',
			sourcelink: 'http://squiloople.com/tag/email/',
		},
		6: {
			address: '@io',
			comment: 'io. currently has an MX-record (Feb 2011)',
			category: 'ISEMAIL_ERR',
			diagnosis: 'ISEMAIL_ERR_NOLOCALPART',
			source: 'Michael Rushton',
			sourcelink: 'http://squiloople.com/tag/email/',
		},
		7: {
			address: '@iana.org',
			category: 'ISEMAIL_ERR',
			diagnosis: 'ISEMAIL_ERR_NOLOCALPART',
			source: 'Michael Rushton',
			sourcelink: 'http://squiloople.com/tag/email/',
		},
		8: {
			address: 'test@iana.org',
			category: 'ISEMAIL_VALID_CATEGORY',
			diagnosis: 'ISEMAIL_VALID',
			source: 'Michael Rushton',
			sourcelink: 'http://squiloople.com/tag/email/',
		},
		9: {
			address: 'test@nominet.org.uk',
			category: 'ISEMAIL_VALID_CATEGORY',
			diagnosis: 'ISEMAIL_VALID',
			source: 'Michael Rushton',
			sourcelink: 'http://squiloople.com/tag/email/',
		},
		10: {
			address: 'test@about.museum',
			category: 'ISEMAIL_VALID_CATEGORY',
			diagnosis: 'ISEMAIL_VALID',
			source: 'Michael Rushton',
			sourcelink: 'http://squiloople.com/tag/email/',
		},
		11: {
			address: 'a@iana.org',
			category: 'ISEMAIL_VALID_CATEGORY',
			diagnosis: 'ISEMAIL_VALID',
			source: 'Michael Rushton',
			sourcelink: 'http://squiloople.com/tag/email/',
		},
		12: {
			address: 'test@e.com',
			category: 'ISEMAIL_DNSWARN',
			diagnosis: 'ISEMAIL_DNSWARN_NO_RECORD',
			source: 'Michael Rushton',
			sourcelink: 'http://squiloople.com/tag/email/',
		},
		13: {
			address: 'test@iana.a',
			category: 'ISEMAIL_DNSWARN',
			diagnosis: 'ISEMAIL_DNSWARN_NO_RECORD',
			source: 'Michael Rushton',
			sourcelink: 'http://squiloople.com/tag/email/',
		},
		14: {
			address: 'test.test@iana.org',
			category: 'ISEMAIL_VALID_CATEGORY',
			diagnosis: 'ISEMAIL_VALID',
			source: 'Michael Rushton',
			sourcelink: 'http://squiloople.com/tag/email/',
		},
		15: {
			address: '.test@iana.org',
			category: 'ISEMAIL_ERR',
			diagnosis: 'ISEMAIL_ERR_DOT_START',
			source: 'Michael Rushton',
			sourcelink: 'http://squiloople.com/tag/email/',
		},
		16: {
			address: 'test.@iana.org',
			category: 'ISEMAIL_ERR',
			diagnosis: 'ISEMAIL_ERR_DOT_END',
			source: 'Michael Rushton',
			sourcelink: 'http://squiloople.com/tag/email/',
		},
		17: {
			address: 'test..iana.org',
			category: 'ISEMAIL_ERR',
			diagnosis: 'ISEMAIL_ERR_CONSECUTIVEDOTS',
			source: 'Michael Rushton',
			sourcelink: 'http://squiloople.com/tag/email/',
		},
		18: {
			address: 'test_exa-mple.com',
			category: 'ISEMAIL_ERR',
			diagnosis: 'ISEMAIL_ERR_NODOMAIN',
			source: 'Michael Rushton',
			sourcelink: 'http://squiloople.com/tag/email/',
		},
		19: {
			address: '!#$%&amp;`*+/=?^`{|},~@iana.org',
			category: 'ISEMAIL_VALID_CATEGORY',
			diagnosis: 'ISEMAIL_VALID',
			source: 'Michael Rushton',
			sourcelink: 'http://squiloople.com/tag/email/',
		},
		20: {
			address: 'test\@test@iana.org',
			category: 'ISEMAIL_ERR',
			diagnosis: 'ISEMAIL_ERR_EXPECTING_ATEXT',
			source: 'Michael Rushton',
			sourcelink: 'http://squiloople.com/tag/email/',
		},
		21: {
			address: '123@iana.org',
			category: 'ISEMAIL_VALID_CATEGORY',
			diagnosis: 'ISEMAIL_VALID',
			source: 'Michael Rushton',
			sourcelink: 'http://squiloople.com/tag/email/',
		},
		22: {
			address: 'test@123.com',
			category: 'ISEMAIL_VALID_CATEGORY',
			diagnosis: 'ISEMAIL_VALID',
			source: 'Michael Rushton',
			sourcelink: 'http://squiloople.com/tag/email/',
		},
		23: {
			address: 'test@iana.123',
			category: 'ISEMAIL_RFC5321',
			diagnosis: 'ISEMAIL_RFC5321_TLDNUMERIC',
			source: 'Michael Rushton',
			sourcelink: 'http://squiloople.com/tag/email/',
		},
		24: {
			address: 'test@255.255.255.255',
			category: 'ISEMAIL_RFC5321',
			diagnosis: 'ISEMAIL_RFC5321_TLDNUMERIC',
			source: 'Michael Rushton',
			sourcelink: 'http://squiloople.com/tag/email/',
		},
		25: {
			address: 'abcdefghijklmnopqrstuvwxyzabcdefghijklmnopqrstuvwxyzabcdefghiklm@iana.org',
			category: 'ISEMAIL_VALID_CATEGORY',
			diagnosis: 'ISEMAIL_VALID',
			source: 'Michael Rushton',
			sourcelink: 'http://squiloople.com/tag/email/',
		},
		26: {
			address: 'abcdefghijklmnopqrstuvwxyzabcdefghijklmnopqrstuvwxyzabcdefghiklmn@iana.org',
			category: 'ISEMAIL_RFC5322',
			diagnosis: 'ISEMAIL_RFC5322_LOCAL_TOOLONG',
			source: 'Michael Rushton',
			sourcelink: 'http://squiloople.com/tag/email/',
		},
		27: {
			address: 'test@abcdefghijklmnopqrstuvwxyzabcdefghijklmnopqrstuvwxyzabcdefghikl.com',
			category: 'ISEMAIL_DNSWARN',
			diagnosis: 'ISEMAIL_DNSWARN_NO_RECORD',
			source: 'Michael Rushton',
			sourcelink: 'http://squiloople.com/tag/email/',
		},
		28: {
			address: 'test@abcdefghijklmnopqrstuvwxyzabcdefghijklmnopqrstuvwxyzabcdefghiklm.com',
			category: 'ISEMAIL_RFC5322',
			diagnosis: 'ISEMAIL_RFC5322_LABEL_TOOLONG',
			source: 'Michael Rushton',
			sourcelink: 'http://squiloople.com/tag/email/',
		},
		29: {
			address: 'test@mason-dixon.com',
			category: 'ISEMAIL_VALID_CATEGORY',
			diagnosis: 'ISEMAIL_VALID',
			source: 'Michael Rushton',
			sourcelink: 'http://squiloople.com/tag/email/',
		},
		30: {
			address: 'test@-iana.org',
			category: 'ISEMAIL_ERR',
			diagnosis: 'ISEMAIL_ERR_DOMAINHYPHENSTART',
			source: 'Michael Rushton',
			sourcelink: 'http://squiloople.com/tag/email/',
		},
		31: {
			address: 'test@iana-.com',
			category: 'ISEMAIL_ERR',
			diagnosis: 'ISEMAIL_ERR_DOMAINHYPHENEND',
			source: 'Michael Rushton',
			sourcelink: 'http://squiloople.com/tag/email/',
		},
		32: {
			address: 'test@c--n.com',
			comment: 'c--n.com currently has an MX-record (May 2011)',
			category: 'ISEMAIL_VALID_CATEGORY',
			diagnosis: 'ISEMAIL_VALID',
			source: 'Michael Rushton',
			sourcelink: 'http://squiloople.com/tag/email/',
		},
		33: {
			address: 'test@iana.co-uk',
			category: 'ISEMAIL_DNSWARN',
			diagnosis: 'ISEMAIL_DNSWARN_NO_RECORD',
			source: 'Michael Rushton',
			sourcelink: 'http://squiloople.com/tag/email/',
		},
		34: {
			address: 'test@.iana.org',
			category: 'ISEMAIL_ERR',
			diagnosis: 'ISEMAIL_ERR_DOT_START',
			source: 'Michael Rushton',
			sourcelink: 'http://squiloople.com/tag/email/',
		},
		35: {
			address: 'test@iana.org.',
			category: 'ISEMAIL_ERR',
			diagnosis: 'ISEMAIL_ERR_DOT_END',
			source: 'Michael Rushton',
			sourcelink: 'http://squiloople.com/tag/email/',
		},
		36: {
			address: 'test@iana..com',
			category: 'ISEMAIL_ERR',
			diagnosis: 'ISEMAIL_ERR_CONSECUTIVEDOTS',
			source: 'Michael Rushton',
			sourcelink: 'http://squiloople.com/tag/email/',
		},
		37: {
			address: 'a@a.b.c.d.e.f.g.h.i.j.k.l.m.n.o.p.q.r.s.t.u.v.w.x.y.z.a.b.c.d.e.f.g.h.i.j.k.l.m.n.o.p.q.r.s.t.u.v.w.x.y.z.a.b.c.d.e.f.g.h.i.j.k.l.m.n.o.p.q.r.s.t.u.v.w.x.y.z.a.b.c.d.e.f.g.h.i.j.k.l.m.n.o.p.q.r.s.t.u.v.w.x.y.z.a.b.c.d.e.f.g.h.i.j.k.l.m.n.o.p.q.r.s.t.u.v',
			category: 'ISEMAIL_DNSWARN',
			diagnosis: 'ISEMAIL_DNSWARN_NO_RECORD',
			source: 'Michael Rushton',
			sourcelink: 'http://squiloople.com/tag/email/',
		},
		38: {
			address: 'abcdefghijklmnopqrstuvwxyzabcdefghijklmnopqrstuvwxyzabcdefghiklm@abcdefghijklmnopqrstuvwxyzabcdefghijklmnopqrstuvwxyzabcdefghikl.abcdefghijklmnopqrstuvwxyzabcdefghijklmnopqrstuvwxyzabcdefghikl.abcdefghijklmnopqrstuvwxyzabcdefghijklmnopqrstuvwxyzabcdefghi',
			category: 'ISEMAIL_DNSWARN',
			diagnosis: 'ISEMAIL_DNSWARN_NO_RECORD',
			source: 'Michael Rushton',
			sourcelink: 'http://squiloople.com/tag/email/',
		},
		39: {
			address: 'abcdefghijklmnopqrstuvwxyzabcdefghijklmnopqrstuvwxyzabcdefghiklm@abcdefghijklmnopqrstuvwxyzabcdefghijklmnopqrstuvwxyzabcdefghikl.abcdefghijklmnopqrstuvwxyzabcdefghijklmnopqrstuvwxyzabcdefghikl.abcdefghijklmnopqrstuvwxyzabcdefghijklmnopqrstuvwxyzabcdefghij',
			category: 'ISEMAIL_RFC5322',
			diagnosis: 'ISEMAIL_RFC5322_TOOLONG',
			source: 'Michael Rushton',
			sourcelink: 'http://squiloople.com/tag/email/',
		},
		40: {
			address: 'a@abcdefghijklmnopqrstuvwxyzabcdefghijklmnopqrstuvwxyzabcdefghikl.abcdefghijklmnopqrstuvwxyzabcdefghijklmnopqrstuvwxyzabcdefghikl.abcdefghijklmnopqrstuvwxyzabcdefghijklmnopqrstuvwxyzabcdefghikl.abcdefghijklmnopqrstuvwxyzabcdefghijklmnopqrstuvwxyzabcdefg.hij',
			category: 'ISEMAIL_RFC5322',
			diagnosis: 'ISEMAIL_RFC5322_TOOLONG',
			source: 'Michael Rushton',
			sourcelink: 'http://squiloople.com/tag/email/',
		},
		41: {
			address: 'a@abcdefghijklmnopqrstuvwxyzabcdefghijklmnopqrstuvwxyzabcdefghikl.abcdefghijklmnopqrstuvwxyzabcdefghijklmnopqrstuvwxyzabcdefghikl.abcdefghijklmnopqrstuvwxyzabcdefghijklmnopqrstuvwxyzabcdefghikl.abcdefghijklmnopqrstuvwxyzabcdefghijklmnopqrstuvwxyzabcdefg.hijk',
			category: 'ISEMAIL_RFC5322',
			diagnosis: 'ISEMAIL_RFC5322_DOMAIN_TOOLONG',
			source: 'Michael Rushton',
			sourcelink: 'http://squiloople.com/tag/email/',
		},
		42: {
			address: '"test"@iana.org',
			category: 'ISEMAIL_RFC5321',
			diagnosis: 'ISEMAIL_RFC5321_QUOTEDSTRING',
			source: 'Michael Rushton',
			sourcelink: 'http://squiloople.com/tag/email/',
		},
		43: {
			address: '""@iana.org',
			category: 'ISEMAIL_RFC5321',
			diagnosis: 'ISEMAIL_RFC5321_QUOTEDSTRING',
			source: 'Michael Rushton',
			sourcelink: 'http://squiloople.com/tag/email/',
		},
		44: {
			address: '"""@iana.org',
			category: 'ISEMAIL_ERR',
			diagnosis: 'ISEMAIL_ERR_EXPECTING_ATEXT',
			source: 'Michael Rushton',
			sourcelink: 'http://squiloople.com/tag/email/',
		},
		45: {
			address: '"\a"@iana.org',
			category: 'ISEMAIL_RFC5321',
			diagnosis: 'ISEMAIL_RFC5321_QUOTEDSTRING',
			source: 'Michael Rushton',
			sourcelink: 'http://squiloople.com/tag/email/',
		},
		46: {
			address: '"\""@iana.org',
			category: 'ISEMAIL_RFC5321',
			diagnosis: 'ISEMAIL_RFC5321_QUOTEDSTRING',
			source: 'Michael Rushton',
			sourcelink: 'http://squiloople.com/tag/email/',
		},
		47: {
			address: '"\"@iana.org',
			category: 'ISEMAIL_ERR',
			diagnosis: 'ISEMAIL_ERR_UNCLOSEDQUOTEDSTR',
			source: 'Michael Rushton',
			sourcelink: 'http://squiloople.com/tag/email/',
		},
		48: {
			address: '"\\"@iana.org',
			category: 'ISEMAIL_RFC5321',
			diagnosis: 'ISEMAIL_RFC5321_QUOTEDSTRING',
			source: 'Michael Rushton',
			sourcelink: 'http://squiloople.com/tag/email/',
		},
		49: {
			address: 'test"@iana.org',
			category: 'ISEMAIL_ERR',
			diagnosis: 'ISEMAIL_ERR_EXPECTING_ATEXT',
			source: 'Michael Rushton',
			sourcelink: 'http://squiloople.com/tag/email/',
		},
		50: {
			address: '"test@iana.org',
			category: 'ISEMAIL_ERR',
			diagnosis: 'ISEMAIL_ERR_UNCLOSEDQUOTEDSTR',
			source: 'Michael Rushton',
			sourcelink: 'http://squiloople.com/tag/email/',
		},
		51: {
			address: '"test"test@iana.org',
			category: 'ISEMAIL_ERR',
			diagnosis: 'ISEMAIL_ERR_ATEXT_AFTER_QS',
			source: 'Michael Rushton',
			sourcelink: 'http://squiloople.com/tag/email/',
		},
		52: {
			address: 'test"text"@iana.org',
			category: 'ISEMAIL_ERR',
			diagnosis: 'ISEMAIL_ERR_EXPECTING_ATEXT',
			source: 'Michael Rushton',
			sourcelink: 'http://squiloople.com/tag/email/',
		},
		53: {
			address: '"test""test"@iana.org',
			category: 'ISEMAIL_ERR',
			diagnosis: 'ISEMAIL_ERR_EXPECTING_ATEXT',
			source: 'Michael Rushton',
			sourcelink: 'http://squiloople.com/tag/email/',
		},
		54: {
			address: '"test"."test"@iana.org',
			category: 'ISEMAIL_DEPREC',
			diagnosis: 'ISEMAIL_DEPREC_LOCALPART',
			source: 'Michael Rushton',
			sourcelink: 'http://squiloople.com/tag/email/',
		},
		55: {
			address: '"test\ test"@iana.org',
			category: 'ISEMAIL_RFC5321',
			diagnosis: 'ISEMAIL_RFC5321_QUOTEDSTRING',
			source: 'Michael Rushton',
			sourcelink: 'http://squiloople.com/tag/email/',
		},
		56: {
			address: '"test".test@iana.org',
			category: 'ISEMAIL_DEPREC',
			diagnosis: 'ISEMAIL_DEPREC_LOCALPART',
			source: 'Michael Rushton',
			sourcelink: 'http://squiloople.com/tag/email/',
		},
		57: {
			address: '"test&#x2400;"@iana.org',
			category: 'ISEMAIL_ERR',
			diagnosis: 'ISEMAIL_ERR_EXPECTING_QTEXT',
			source: 'Michael Rushton',
			sourcelink: 'http://squiloople.com/tag/email/',
		},
		58: {
			address: '"test\&#x2400;"@iana.org',
			category: 'ISEMAIL_DEPREC',
			diagnosis: 'ISEMAIL_DEPREC_QP',
			source: 'Michael Rushton',
			sourcelink: 'http://squiloople.com/tag/email/',
		},
		59: {
			address: '"abcdefghijklmnopqrstuvwxyz abcdefghijklmnopqrstuvwxyz abcdefghj"@iana.org',
			comment: 'Quotes are still part of the length restriction',
			category: 'ISEMAIL_RFC5322',
			diagnosis: 'ISEMAIL_RFC5322_LOCAL_TOOLONG',
			source: 'Dominic Sayers',
			sourcelink: 'http://isemail.info',
		},
		60: {
			address: '"abcdefghijklmnopqrstuvwxyz abcdefghijklmnopqrstuvwxyz abcdefg\h"@iana.org',
			comment: 'Quoted pair is still part of the length restriction',
			category: 'ISEMAIL_RFC5322',
			diagnosis: 'ISEMAIL_RFC5322_LOCAL_TOOLONG',
			source: 'Dominic Sayers',
			sourcelink: 'http://isemail.info',
		},
		61: {
			address: 'test@[255.255.255.255]',
			category: 'ISEMAIL_RFC5321',
			diagnosis: 'ISEMAIL_RFC5321_ADDRESSLITERAL',
			source: 'Michael Rushton',
			sourcelink: 'http://squiloople.com/tag/email/',
		},
		62: {
			address: 'test@a[255.255.255.255]',
			category: 'ISEMAIL_ERR',
			diagnosis: 'ISEMAIL_ERR_EXPECTING_ATEXT',
			source: 'Michael Rushton',
			sourcelink: 'http://squiloople.com/tag/email/',
		},
		63: {
			address: 'test@[255.255.255]',
			category: 'ISEMAIL_RFC5322',
			diagnosis: 'ISEMAIL_RFC5322_DOMAINLITERAL',
			source: 'Michael Rushton',
			sourcelink: 'http://squiloople.com/tag/email/',
		},
		64: {
			address: 'test@[255.255.255.255.255]',
			category: 'ISEMAIL_RFC5322',
			diagnosis: 'ISEMAIL_RFC5322_DOMAINLITERAL',
			source: 'Michael Rushton',
			sourcelink: 'http://squiloople.com/tag/email/',
		},
		65: {
			address: 'test@[255.255.255.256]',
			category: 'ISEMAIL_RFC5322',
			diagnosis: 'ISEMAIL_RFC5322_DOMAINLITERAL',
			source: 'Michael Rushton',
			sourcelink: 'http://squiloople.com/tag/email/',
		},
		66: {
			address: 'test@[1111:2222:3333:4444:5555:6666:7777:8888]',
			category: 'ISEMAIL_RFC5322',
			diagnosis: 'ISEMAIL_RFC5322_DOMAINLITERAL',
			source: 'Michael Rushton',
			sourcelink: 'http://squiloople.com/tag/email/',
		},
		67: {
			address: 'test@[IPv6:1111:2222:3333:4444:5555:6666:7777]',
			category: 'ISEMAIL_RFC5322',
			diagnosis: 'ISEMAIL_RFC5322_IPV6_GRPCOUNT',
			source: 'Michael Rushton',
			sourcelink: 'http://squiloople.com/tag/email/',
		},
		68: {
			address: 'test@[IPv6:1111:2222:3333:4444:5555:6666:7777:8888]',
			category: 'ISEMAIL_RFC5321',
			diagnosis: 'ISEMAIL_RFC5321_ADDRESSLITERAL',
			source: 'Michael Rushton',
			sourcelink: 'http://squiloople.com/tag/email/',
		},
		69: {
			address: 'test@[IPv6:1111:2222:3333:4444:5555:6666:7777:8888:9999]',
			category: 'ISEMAIL_RFC5322',
			diagnosis: 'ISEMAIL_RFC5322_IPV6_GRPCOUNT',
			source: 'Michael Rushton',
			sourcelink: 'http://squiloople.com/tag/email/',
		},
		70: {
			address: 'test@[IPv6:1111:2222:3333:4444:5555:6666:7777:888G]',
			category: 'ISEMAIL_RFC5322',
			diagnosis: 'ISEMAIL_RFC5322_IPV6_BADCHAR',
			source: 'Michael Rushton',
			sourcelink: 'http://squiloople.com/tag/email/',
		},
		71: {
			address: 'test@[IPv6:1111:2222:3333:4444:5555:6666::8888]',
			category: 'ISEMAIL_RFC5321',
			diagnosis: 'ISEMAIL_RFC5321_IPV6DEPRECATED',
			source: 'Michael Rushton',
			sourcelink: 'http://squiloople.com/tag/email/',
		},
		72: {
			address: 'test@[IPv6:1111:2222:3333:4444:5555::8888]',
			category: 'ISEMAIL_RFC5321',
			diagnosis: 'ISEMAIL_RFC5321_ADDRESSLITERAL',
			source: 'Michael Rushton',
			sourcelink: 'http://squiloople.com/tag/email/',
		},
		73: {
			address: 'test@[IPv6:1111:2222:3333:4444:5555:6666::7777:8888]',
			category: 'ISEMAIL_RFC5322',
			diagnosis: 'ISEMAIL_RFC5322_IPV6_MAXGRPS',
			source: 'Michael Rushton',
			sourcelink: 'http://squiloople.com/tag/email/',
		},
		74: {
			address: 'test@[IPv6::3333:4444:5555:6666:7777:8888]',
			category: 'ISEMAIL_RFC5322',
			diagnosis: 'ISEMAIL_RFC5322_IPV6_COLONSTRT',
			source: 'Michael Rushton',
			sourcelink: 'http://squiloople.com/tag/email/',
		},
		75: {
			address: 'test@[IPv6:::3333:4444:5555:6666:7777:8888]',
			category: 'ISEMAIL_RFC5321',
			diagnosis: 'ISEMAIL_RFC5321_ADDRESSLITERAL',
			source: 'Michael Rushton',
			sourcelink: 'http://squiloople.com/tag/email/',
		},
		76: {
			address: 'test@[IPv6:1111::4444:5555::8888]',
			category: 'ISEMAIL_RFC5322',
			diagnosis: 'ISEMAIL_RFC5322_IPV6_2X2XCOLON',
			source: 'Michael Rushton',
			sourcelink: 'http://squiloople.com/tag/email/',
		},
		77: {
			address: 'test@[IPv6:::]',
			category: 'ISEMAIL_RFC5321',
			diagnosis: 'ISEMAIL_RFC5321_ADDRESSLITERAL',
			source: 'Michael Rushton',
			sourcelink: 'http://squiloople.com/tag/email/',
		},
		78: {
			address: 'test@[IPv6:1111:2222:3333:4444:5555:255.255.255.255]',
			category: 'ISEMAIL_RFC5322',
			diagnosis: 'ISEMAIL_RFC5322_IPV6_GRPCOUNT',
			source: 'Michael Rushton',
			sourcelink: 'http://squiloople.com/tag/email/',
		},
		79: {
			address: 'test@[IPv6:1111:2222:3333:4444:5555:6666:255.255.255.255]',
			category: 'ISEMAIL_RFC5321',
			diagnosis: 'ISEMAIL_RFC5321_ADDRESSLITERAL',
			source: 'Michael Rushton',
			sourcelink: 'http://squiloople.com/tag/email/',
		},
		80: {
			address: 'test@[IPv6:1111:2222:3333:4444:5555:6666:7777:255.255.255.255]',
			category: 'ISEMAIL_RFC5322',
			diagnosis: 'ISEMAIL_RFC5322_IPV6_GRPCOUNT',
			source: 'Michael Rushton',
			sourcelink: 'http://squiloople.com/tag/email/',
		},
		81: {
			address: 'test@[IPv6:1111:2222:3333:4444::255.255.255.255]',
			category: 'ISEMAIL_RFC5321',
			diagnosis: 'ISEMAIL_RFC5321_ADDRESSLITERAL',
			source: 'Michael Rushton',
			sourcelink: 'http://squiloople.com/tag/email/',
		},
		82: {
			address: 'test@[IPv6:1111:2222:3333:4444:5555:6666::255.255.255.255]',
			category: 'ISEMAIL_RFC5322',
			diagnosis: 'ISEMAIL_RFC5322_IPV6_MAXGRPS',
			source: 'Michael Rushton',
			sourcelink: 'http://squiloople.com/tag/email/',
		},
		83: {
			address: 'test@[IPv6:1111:2222:3333:4444:::255.255.255.255]',
			category: 'ISEMAIL_RFC5322',
			diagnosis: 'ISEMAIL_RFC5322_IPV6_2X2XCOLON',
			source: 'Michael Rushton',
			sourcelink: 'http://squiloople.com/tag/email/',
		},
		84: {
			address: 'test@[IPv6::255.255.255.255]',
			category: 'ISEMAIL_RFC5322',
			diagnosis: 'ISEMAIL_RFC5322_IPV6_COLONSTRT',
			source: 'Michael Rushton',
			sourcelink: 'http://squiloople.com/tag/email/',
		},
		85: {
			address: ' test @iana.org',
			category: 'ISEMAIL_DEPREC',
			diagnosis: 'ISEMAIL_DEPREC_CFWS_NEAR_AT',
			source: 'Michael Rushton',
			sourcelink: 'http://squiloople.com/tag/email/',
		},
		86: {
			address: 'test@ iana .com',
			category: 'ISEMAIL_DEPREC',
			diagnosis: 'ISEMAIL_DEPREC_CFWS_NEAR_AT',
			source: 'Michael Rushton',
			sourcelink: 'http://squiloople.com/tag/email/',
		},
		87: {
			address: 'test . test@iana.org',
			category: 'ISEMAIL_DEPREC',
			diagnosis: 'ISEMAIL_DEPREC_FWS',
			source: 'Michael Rushton',
			sourcelink: 'http://squiloople.com/tag/email/',
		},
		88: {
			address: '&#x240D;&#x240A; test@iana.org',
			comment: 'FWS',
			category: 'ISEMAIL_CFWS',
			diagnosis: 'ISEMAIL_CFWS_FWS',
			source: 'Michael Rushton',
			sourcelink: 'http://squiloople.com/tag/email/',
		},
		89: {
			address: '&#x240D;&#x240A; &#x240D;&#x240A; test@iana.org',
			comment: 'FWS with one line composed entirely of WSP -- only allowed as obsolete FWS (someone might allow only non-obsolete FWS)',
			category: 'ISEMAIL_DEPREC',
			diagnosis: 'ISEMAIL_DEPREC_FWS',
			source: 'Michael Rushton',
			sourcelink: 'http://squiloople.com/tag/email/',
		},
		90: {
			address: '(comment)test@iana.org',
			category: 'ISEMAIL_CFWS',
			diagnosis: 'ISEMAIL_CFWS_COMMENT',
			source: 'Michael Rushton',
			sourcelink: 'http://squiloople.com/tag/email/',
		},
		91: {
			address: '((comment)test@iana.org',
			category: 'ISEMAIL_ERR',
			diagnosis: 'ISEMAIL_ERR_UNCLOSEDCOMMENT',
			source: 'Michael Rushton',
			sourcelink: 'http://squiloople.com/tag/email/',
		},
		92: {
			address: '(comment(comment))test@iana.org',
			category: 'ISEMAIL_CFWS',
			diagnosis: 'ISEMAIL_CFWS_COMMENT',
			source: 'Michael Rushton',
			sourcelink: 'http://squiloople.com/tag/email/',
		},
		93: {
			address: 'test@(comment)iana.org',
			category: 'ISEMAIL_DEPREC',
			diagnosis: 'ISEMAIL_DEPREC_CFWS_NEAR_AT',
			source: 'Michael Rushton',
			sourcelink: 'http://squiloople.com/tag/email/',
		},
		94: {
			address: 'test(comment)test@iana.org',
			category: 'ISEMAIL_ERR',
			diagnosis: 'ISEMAIL_ERR_ATEXT_AFTER_CFWS',
			source: 'Michael Rushton',
			sourcelink: 'http://squiloople.com/tag/email/',
		},
		95: {
			address: 'test@(comment)[255.255.255.255]',
			category: 'ISEMAIL_DEPREC',
			diagnosis: 'ISEMAIL_DEPREC_CFWS_NEAR_AT',
			source: 'Michael Rushton',
			sourcelink: 'http://squiloople.com/tag/email/',
		},
		96: {
			address: '(comment)abcdefghijklmnopqrstuvwxyzabcdefghijklmnopqrstuvwxyzabcdefghiklm@iana.org',
			category: 'ISEMAIL_CFWS',
			diagnosis: 'ISEMAIL_CFWS_COMMENT',
			source: 'Michael Rushton',
			sourcelink: 'http://squiloople.com/tag/email/',
		},
		97: {
			address: 'test@(comment)abcdefghijklmnopqrstuvwxyzabcdefghijklmnopqrstuvwxyzabcdefghikl.com',
			category: 'ISEMAIL_DEPREC',
			diagnosis: 'ISEMAIL_DEPREC_CFWS_NEAR_AT',
			source: 'Michael Rushton',
			sourcelink: 'http://squiloople.com/tag/email/',
		},
		98: {
			address: '(comment)test@abcdefghijklmnopqrstuvwxyzabcdefghijklmnopqrstuvwxyzabcdefghik.abcdefghijklmnopqrstuvwxyzabcdefghijklmnopqrstuvwxyzabcdefghik.abcdefghijklmnopqrstuvwxyzabcdefghijklmnopqrstuvwxyzabcdefghijk.abcdefghijklmnopqrstuvwxyzabcdefghijk.abcdefghijklmnopqrstu',
			category: 'ISEMAIL_CFWS',
			diagnosis: 'ISEMAIL_CFWS_COMMENT',
			source: 'Michael Rushton',
			sourcelink: 'http://squiloople.com/tag/email/',
		},
		99: {
			address: 'test@iana.org&#x240A;',
			category: 'ISEMAIL_ERR',
			diagnosis: 'ISEMAIL_ERR_EXPECTING_ATEXT',
			source: 'Michael Rushton',
			sourcelink: 'http://squiloople.com/tag/email/',
		},
		100: {
			address: 'test@xn--hxajbheg2az3al.xn--jxalpdlp',
			comment: 'A valid IDN from ICANN\'s <a href="http://idn.icann.org/#The_example.test_names">IDN TLD evaluation gateway</a>',
			category: 'ISEMAIL_VALID_CATEGORY',
			diagnosis: 'ISEMAIL_VALID',
			source: 'Michael Rushton',
			sourcelink: 'http://squiloople.com/tag/email/',
		},
		101: {
			address: 'xn--test@iana.org',
			comment: 'RFC 3490: "unless the email standards are revised to invite the use of IDNA for local parts, a domain label that holds the local part of an email address SHOULD NOT begin with the ACE prefix, and even if it does, it is to be interpreted literally as a local part that happens to begin with the ACE prefix"',
			category: 'ISEMAIL_VALID_CATEGORY',
			diagnosis: 'ISEMAIL_VALID',
			source: 'Dominic Sayers',
			sourcelink: 'http://isemail.info',
		},
		102: {
			address: 'test@iana.org-',
			category: 'ISEMAIL_ERR',
			diagnosis: 'ISEMAIL_ERR_DOMAINHYPHENEND',
			source: 'Dominic Sayers',
			sourcelink: 'http://isemail.info',
		},
		103: {
			address: '"test@iana.org',
			category: 'ISEMAIL_ERR',
			diagnosis: 'ISEMAIL_ERR_UNCLOSEDQUOTEDSTR',
			source: 'Dominic Sayers',
			sourcelink: 'http://isemail.info',
		},
		104: {
			address: '(test@iana.org',
			category: 'ISEMAIL_ERR',
			diagnosis: 'ISEMAIL_ERR_UNCLOSEDCOMMENT',
			source: 'Dominic Sayers',
			sourcelink: 'http://isemail.info',
		},
		105: {
			address: 'test@(iana.org',
			category: 'ISEMAIL_ERR',
			diagnosis: 'ISEMAIL_ERR_UNCLOSEDCOMMENT',
			source: 'Dominic Sayers',
			sourcelink: 'http://isemail.info',
		},
		106: {
			address: 'test@[1.2.3.4',
			category: 'ISEMAIL_ERR',
			diagnosis: 'ISEMAIL_ERR_UNCLOSEDDOMLIT',
			source: 'Dominic Sayers',
			sourcelink: 'http://isemail.info',
		},
		107: {
			address: '"test\"@iana.org',
			category: 'ISEMAIL_ERR',
			diagnosis: 'ISEMAIL_ERR_UNCLOSEDQUOTEDSTR',
			source: 'Dominic Sayers',
			sourcelink: 'http://isemail.info',
		},
		108: {
			address: '(comment\)test@iana.org',
			category: 'ISEMAIL_ERR',
			diagnosis: 'ISEMAIL_ERR_UNCLOSEDCOMMENT',
			source: 'Dominic Sayers',
			sourcelink: 'http://isemail.info',
		},
		109: {
			address: 'test@iana.org(comment\)',
			category: 'ISEMAIL_ERR',
			diagnosis: 'ISEMAIL_ERR_UNCLOSEDCOMMENT',
			source: 'Dominic Sayers',
			sourcelink: 'http://isemail.info',
		},
		110: {
			address: 'test@iana.org(comment\\',
			category: 'ISEMAIL_ERR',
			diagnosis: 'ISEMAIL_ERR_BACKSLASHEND',
			source: 'Dominic Sayers',
			sourcelink: 'http://isemail.info',
		},
		112: {
			address: 'test@[RFC-5322-domain-literal]',
			category: 'ISEMAIL_RFC5322',
			diagnosis: 'ISEMAIL_RFC5322_DOMAINLITERAL',
			source: 'Dominic Sayers',
			sourcelink: 'http://isemail.info',
		},
		113: {
			address: 'test@[RFC-5322]-domain-literal]',
			category: 'ISEMAIL_ERR',
			diagnosis: 'ISEMAIL_ERR_ATEXT_AFTER_DOMLIT',
			source: 'Dominic Sayers',
			sourcelink: 'http://isemail.info',
		},
		114: {
			address: 'test@[RFC-5322-[domain-literal]',
			category: 'ISEMAIL_ERR',
			diagnosis: 'ISEMAIL_ERR_EXPECTING_DTEXT',
			source: 'Dominic Sayers',
			sourcelink: 'http://isemail.info',
		},
		115: {
			address: 'test@[RFC-5322-\&#x2407;-domain-literal]',
			comment: 'obs-dtext <strong>and</strong> obs-qp',
			category: 'ISEMAIL_RFC5322',
			diagnosis: 'ISEMAIL_RFC5322_DOMLIT_OBSDTEXT',
			source: 'Dominic Sayers',
			sourcelink: 'http://isemail.info',
		},
		116: {
			address: 'test@[RFC-5322-\&#x2409;-domain-literal]',
			category: 'ISEMAIL_RFC5322',
			diagnosis: 'ISEMAIL_RFC5322_DOMLIT_OBSDTEXT',
			source: 'Dominic Sayers',
			sourcelink: 'http://isemail.info',
		},
		117: {
			address: 'test@[RFC-5322-\]-domain-literal]',
			category: 'ISEMAIL_RFC5322',
			diagnosis: 'ISEMAIL_RFC5322_DOMLIT_OBSDTEXT',
			source: 'Dominic Sayers',
			sourcelink: 'http://isemail.info',
		},
		118: {
			address: 'test@[RFC-5322-domain-literal\]',
			category: 'ISEMAIL_ERR',
			diagnosis: 'ISEMAIL_ERR_UNCLOSEDDOMLIT',
			source: 'Dominic Sayers',
			sourcelink: 'http://isemail.info',
		},
		119: {
			address: 'test@[RFC-5322-domain-literal\\',
			category: 'ISEMAIL_ERR',
			diagnosis: 'ISEMAIL_ERR_BACKSLASHEND',
			source: 'Dominic Sayers',
			sourcelink: 'http://isemail.info',
		},
		120: {
			address: 'test@[RFC 5322 domain literal]',
			comment: 'Spaces are FWS in a domain literal',
			category: 'ISEMAIL_RFC5322',
			diagnosis: 'ISEMAIL_RFC5322_DOMAINLITERAL',
			source: 'Dominic Sayers',
			sourcelink: 'http://isemail.info',
		},
		121: {
			address: 'test@[RFC-5322-domain-literal] (comment)',
			category: 'ISEMAIL_RFC5322',
			diagnosis: 'ISEMAIL_RFC5322_DOMAINLITERAL',
			source: 'Dominic Sayers',
			sourcelink: 'http://isemail.info',
		},
		122: {
			address: '@iana.org',
			category: 'ISEMAIL_ERR',
			diagnosis: 'ISEMAIL_ERR_EXPECTING_ATEXT',
			source: 'Dominic Sayers',
			sourcelink: 'http://isemail.info',
		},
		123: {
			address: 'test@.org',
			category: 'ISEMAIL_ERR',
			diagnosis: 'ISEMAIL_ERR_EXPECTING_ATEXT',
			source: 'Dominic Sayers',
			sourcelink: 'http://isemail.info',
		},
		124: {
			address: '""@iana.org',
			category: 'ISEMAIL_DEPREC',
			diagnosis: 'ISEMAIL_DEPREC_QTEXT',
			source: 'Dominic Sayers',
			sourcelink: 'http://isemail.info',
		},
		125: {
			address: '"\"@iana.org',
			category: 'ISEMAIL_DEPREC',
			diagnosis: 'ISEMAIL_DEPREC_QP',
			source: 'Dominic Sayers',
			sourcelink: 'http://isemail.info',
		},
		126: {
			address: '()test@iana.org',
			category: 'ISEMAIL_DEPREC',
			diagnosis: 'ISEMAIL_DEPREC_CTEXT',
			source: 'Dominic Sayers',
			sourcelink: 'http://isemail.info',
		},
		127: {
			address: 'test@iana.org&#x240D;',
			comment: 'No LF after the CR',
			category: 'ISEMAIL_ERR',
			diagnosis: 'ISEMAIL_ERR_CR_NO_LF',
			source: 'Dominic Sayers',
			sourcelink: 'http://isemail.info',
		},
		128: {
			address: '&#x240D;test@iana.org',
			comment: 'No LF after the CR',
			category: 'ISEMAIL_ERR',
			diagnosis: 'ISEMAIL_ERR_CR_NO_LF',
			source: 'Dominic Sayers',
			sourcelink: 'http://isemail.info',
		},
		129: {
			address: '"&#x240D;test"@iana.org',
			comment: 'No LF after the CR',
			category: 'ISEMAIL_ERR',
			diagnosis: 'ISEMAIL_ERR_CR_NO_LF',
			source: 'Dominic Sayers',
			sourcelink: 'http://isemail.info',
		},
		130: {
			address: '(&#x240D;)test@iana.org',
			comment: 'No LF after the CR',
			category: 'ISEMAIL_ERR',
			diagnosis: 'ISEMAIL_ERR_CR_NO_LF',
			source: 'Dominic Sayers',
			sourcelink: 'http://isemail.info',
		},
		131: {
			address: 'test@iana.org(&#x240D;)',
			comment: 'No LF after the CR',
			category: 'ISEMAIL_ERR',
			diagnosis: 'ISEMAIL_ERR_CR_NO_LF',
			source: 'Dominic Sayers',
			sourcelink: 'http://isemail.info',
		},
		132: {
			address: '&#x240A;test@iana.org',
			category: 'ISEMAIL_ERR',
			diagnosis: 'ISEMAIL_ERR_EXPECTING_ATEXT',
			source: 'Michael Rushton',
			sourcelink: 'http://squiloople.com/tag/email/',
		},
		133: {
			address: '"&#x240A;"@iana.org',
			category: 'ISEMAIL_ERR',
			diagnosis: 'ISEMAIL_ERR_EXPECTING_QTEXT',
			source: 'Dominic Sayers',
			sourcelink: 'http://isemail.info',
		},
		134: {
			address: '"\&#x240A;"@iana.org',
			category: 'ISEMAIL_DEPREC',
			diagnosis: 'ISEMAIL_DEPREC_QP',
			source: 'Dominic Sayers',
			sourcelink: 'http://isemail.info',
		},
		135: {
			address: '(&#x240A;)test@iana.org',
			category: 'ISEMAIL_ERR',
			diagnosis: 'ISEMAIL_ERR_EXPECTING_CTEXT',
			source: 'Dominic Sayers',
			sourcelink: 'http://isemail.info',
		},
		136: {
			address: '&#x2407;@iana.org',
			category: 'ISEMAIL_ERR',
			diagnosis: 'ISEMAIL_ERR_EXPECTING_ATEXT',
			source: 'Dominic Sayers',
			sourcelink: 'http://isemail.info',
		},
		137: {
			address: 'test@&#x2407;.org',
			category: 'ISEMAIL_ERR',
			diagnosis: 'ISEMAIL_ERR_EXPECTING_ATEXT',
			source: 'Dominic Sayers',
			sourcelink: 'http://isemail.info',
		},
		138: {
			address: '"&#x2407;"@iana.org',
			category: 'ISEMAIL_DEPREC',
			diagnosis: 'ISEMAIL_DEPREC_QTEXT',
			source: 'Dominic Sayers',
			sourcelink: 'http://isemail.info',
		},
		139: {
			address: '"\&#x2407;"@iana.org',
			category: 'ISEMAIL_DEPREC',
			diagnosis: 'ISEMAIL_DEPREC_QP',
			source: 'Dominic Sayers',
			sourcelink: 'http://isemail.info',
		},
		140: {
			address: '(&#x2407;)test@iana.org',
			category: 'ISEMAIL_DEPREC',
			diagnosis: 'ISEMAIL_DEPREC_CTEXT',
			source: 'Dominic Sayers',
			sourcelink: 'http://isemail.info',
		},
		141: {
			address: '&#x240D;&#x240A;test@iana.org',
			comment: 'Not FWS because no actual white space',
			category: 'ISEMAIL_ERR',
			diagnosis: 'ISEMAIL_ERR_FWS_CRLF_END',
			source: 'Dominic Sayers',
			sourcelink: 'http://isemail.info',
		},
		142: {
			address: '&#x240D;&#x240A; &#x240D;&#x240A;test@iana.org',
			comment: 'Not obs-FWS because there must be white space on each "fold"',
			category: 'ISEMAIL_ERR',
			diagnosis: 'ISEMAIL_ERR_FWS_CRLF_END',
			source: 'Dominic Sayers',
			sourcelink: 'http://isemail.info',
		},
		143: {
			address: ' &#x240D;&#x240A;test@iana.org',
			comment: 'Not FWS because no white space after the fold',
			category: 'ISEMAIL_ERR',
			diagnosis: 'ISEMAIL_ERR_FWS_CRLF_END',
			source: 'Dominic Sayers',
			sourcelink: 'http://isemail.info',
		},
		144: {
			address: ' &#x240D;&#x240A; test@iana.org',
			comment: 'FWS',
			category: 'ISEMAIL_CFWS',
			diagnosis: 'ISEMAIL_CFWS_FWS',
			source: 'Dominic Sayers',
			sourcelink: 'http://isemail.info',
		},
		145: {
			address: ' &#x240D;&#x240A; &#x240D;&#x240A;test@iana.org',
			comment: 'Not FWS because no white space after the second fold',
			category: 'ISEMAIL_ERR',
			diagnosis: 'ISEMAIL_ERR_FWS_CRLF_END',
			source: 'Dominic Sayers',
			sourcelink: 'http://isemail.info',
		},
		146: {
			address: ' &#x240D;&#x240A;&#x240D;&#x240A;test@iana.org',
			comment: 'Not FWS because no white space after either fold',
			category: 'ISEMAIL_ERR',
			diagnosis: 'ISEMAIL_ERR_FWS_CRLF_X2',
			source: 'Dominic Sayers',
			sourcelink: 'http://isemail.info',
		},
		147: {
			address: ' &#x240D;&#x240A;&#x240D;&#x240A; test@iana.org',
			comment: 'Not FWS because no white space after the first fold',
			category: 'ISEMAIL_ERR',
			diagnosis: 'ISEMAIL_ERR_FWS_CRLF_X2',
			source: 'Dominic Sayers',
			sourcelink: 'http://isemail.info',
		},
		148: {
			address: 'test@iana.org&#x240D;&#x240A; ',
			comment: 'FWS',
			category: 'ISEMAIL_CFWS',
			diagnosis: 'ISEMAIL_CFWS_FWS',
			source: 'Dominic Sayers',
			sourcelink: 'http://isemail.info',
		},
		149: {
			address: 'test@iana.org&#x240D;&#x240A; &#x240D;&#x240A; ',
			comment: 'FWS with one line composed entirely of WSP -- only allowed as obsolete FWS (someone might allow only non-obsolete FWS)',
			category: 'ISEMAIL_DEPREC',
			diagnosis: 'ISEMAIL_DEPREC_FWS',
			source: 'Dominic Sayers',
			sourcelink: 'http://isemail.info',
		},
		150: {
			address: 'test@iana.org&#x240D;&#x240A;',
			comment: 'Not FWS because no actual white space',
			category: 'ISEMAIL_ERR',
			diagnosis: 'ISEMAIL_ERR_FWS_CRLF_END',
			source: 'Dominic Sayers',
			sourcelink: 'http://isemail.info',
		},
		151: {
			address: 'test@iana.org&#x240D;&#x240A; &#x240D;&#x240A;',
			comment: 'Not obs-FWS because there must be white space on each "fold"',
			category: 'ISEMAIL_ERR',
			diagnosis: 'ISEMAIL_ERR_FWS_CRLF_END',
			source: 'Dominic Sayers',
			sourcelink: 'http://isemail.info',
		},
		152: {
			address: 'test@iana.org &#x240D;&#x240A;',
			comment: 'Not FWS because no white space after the fold',
			category: 'ISEMAIL_ERR',
			diagnosis: 'ISEMAIL_ERR_FWS_CRLF_END',
			source: 'Dominic Sayers',
			sourcelink: 'http://isemail.info',
		},
		153: {
			address: 'test@iana.org &#x240D;&#x240A; ',
			comment: 'FWS',
			category: 'ISEMAIL_CFWS',
			diagnosis: 'ISEMAIL_CFWS_FWS',
			source: 'Dominic Sayers',
			sourcelink: 'http://isemail.info',
		},
		154: {
			address: 'test@iana.org &#x240D;&#x240A; &#x240D;&#x240A;',
			comment: 'Not FWS because no white space after the second fold',
			category: 'ISEMAIL_ERR',
			diagnosis: 'ISEMAIL_ERR_FWS_CRLF_END',
			source: 'Dominic Sayers',
			sourcelink: 'http://isemail.info',
		},
		155: {
			address: 'test@iana.org &#x240D;&#x240A;&#x240D;&#x240A;',
			comment: 'Not FWS because no white space after either fold',
			category: 'ISEMAIL_ERR',
			diagnosis: 'ISEMAIL_ERR_FWS_CRLF_X2',
			source: 'Dominic Sayers',
			sourcelink: 'http://isemail.info',
		},
		156: {
			address: 'test@iana.org &#x240D;&#x240A;&#x240D;&#x240A; ',
			comment: 'Not FWS because no white space after the first fold',
			category: 'ISEMAIL_ERR',
			diagnosis: 'ISEMAIL_ERR_FWS_CRLF_X2',
			source: 'Dominic Sayers',
			sourcelink: 'http://isemail.info',
		},
		157: {
			address: ' test@iana.org',
			category: 'ISEMAIL_CFWS',
			diagnosis: 'ISEMAIL_CFWS_FWS',
			source: 'Dominic Sayers',
			sourcelink: 'http://isemail.info',
		},
		158: {
			address: 'test@iana.org ',
			category: 'ISEMAIL_CFWS',
			diagnosis: 'ISEMAIL_CFWS_FWS',
			source: 'Dominic Sayers',
			sourcelink: 'http://isemail.info',
		},
		159: {
			address: 'test@[IPv6:1::2:]',
			category: 'ISEMAIL_RFC5322',
			diagnosis: 'ISEMAIL_RFC5322_IPV6_COLONEND',
			source: 'Dominic Sayers',
			sourcelink: 'http://isemail.info',
		},
		160: {
			address: '"test\&#xA9;"@iana.org',
			category: 'ISEMAIL_ERR',
			diagnosis: 'ISEMAIL_ERR_EXPECTING_QPAIR',
			source: 'Dominic Sayers',
			sourcelink: 'http://isemail.info',
		},
		161: {
			address: 'test@iana/icann.org',
			category: 'ISEMAIL_RFC5322',
			diagnosis: 'ISEMAIL_RFC5322_DOMAIN',
			source: 'Dominic Sayers',
			sourcelink: 'http://isemail.info',
		},
		165: {
			address: 'test.(comment)test@iana.org',
			category: 'ISEMAIL_DEPREC',
			diagnosis: 'ISEMAIL_DEPREC_COMMENT',
			source: 'Dominic Sayers',
			sourcelink: 'http://isemail.info',
		},
		166: {
			address: 'test@org',
			category: 'ISEMAIL_RFC5321',
			diagnosis: 'ISEMAIL_RFC5321_TLD',
			source: 'Dominic Sayers',
			sourcelink: 'http://isemail.info',
		},
		167: {
			address: 'test@test.com',
			comment: 'test.com has an A-record but not an MX-record',
			category: 'ISEMAIL_DNSWARN',
			diagnosis: 'ISEMAIL_DNSWARN_NO_MX_RECORD',
			source: 'Dominic Sayers',
			sourcelink: 'http://isemail.info',
		},
		168: {
			address: 'test@nic.no',
			comment: 'nic.no currently has no MX-records or A-records (Feb 2011). If you are seeing an A-record for nic.io then try setting your DNS server to 8.8.8.8 (the Google DNS server) - your DNS server may be faking an A-record (OpenDNS does this, for instance).',
			category: 'ISEMAIL_DNSWARN',
			diagnosis: 'ISEMAIL_DNSWARN_NO_RECORD',
			source: 'Dominic Sayers',
			sourcelink: 'http://isemail.info',
		}
	}
};