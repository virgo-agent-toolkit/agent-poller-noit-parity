agent-poller-noit-parity
========================


1: docker run -i -t  -P --name postgres -d nachiket/postgres
 
2: docker run --name apache_borrowed -p 80:80 -p 443:443 -d eboraas/apache
 
3: docker run -p 32322:32322 -p 43191:43191 -p 8888:8888 -ti --link postgres:postgres --link apache_borrowed:apache --name noit nachiket/noit
 
4: docker run -ti --link noit:noit --name  noit_client_t  nachiket/noit_client_tester /bin/bash

#4 runs a bunch of noit client tests from https://github.com/virgo-agent-toolkit/noit_client/blob/master/test/test_noit_client.js against the noit container. 



Todo:

1: Open source the noit_client and make a npm package available
2: Create a make file which allows us to build all docker images, start and link them 
3: Add a testing library (tape?) and create basic tests which will exercise noit and the agent-poller for parity
