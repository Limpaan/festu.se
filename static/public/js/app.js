/* app.js with site functionality */
angular.module('festu', [
  'ngRoute'])
  .config(function($routeProvider, $locationProvider) {
    $routeProvider
    .when('/', {
        templateUrl: 'views/home.html',
        controller: 'HomeCtrl',
        controllerAs: 'ctrl'
    })
    .when('/parties', {
        templateUrl: 'views/parties.html',
        controller: 'PartiesCtrl'
    })
    .when('/about', {
        templateUrl: 'views/about.html',
        controller: 'AboutCtrl'
    })
    .when('/contact', {
        templateUrl: 'views/contact.html',
        controller: 'ContactCtrl'
    })
    .otherwise('/');
    $locationProvider.html5Mode(true);
  })
  .controller('MainCtrl', function() {
  })
  .controller('HomeCtrl', function($rootScope) {
    $rootScope.active = null;
    this.party = {
      name: 'Nollkalaset',
      date: new Date(),
      poster: {
        small: 'http://festu.chs.chalmers.se/images/kalas/original/139.png',
        large: 'http://festu.chs.chalmers.se/images/kalas/original/139.png',
      },
      ticketSale: {
        sales: [{
          startTime: new Date(2016, 7, 22, 12, 0, 0),
          endTime: new Date(2016, 7, 22, 13, 0, 0),
          locations: [
            'Teknologgården (Johanneberg)',
            'Jupiter (Lindholmen)'
          ],
          info: 'Chalmerist with valid student ID only\nMax 1+7 tickets/person'
        }, {
          startTime: new Date(2016, 7, 23, 12, 0, 0),
          endTime: new Date(2016, 7, 23, 13, 0, 0),
          locations: [
            'Teknologgården (Johanneberg)'
          ],
          info: 'Anyone can buy\nMax 8 tickets/person'
        }],
        note: 'Reserve for changes, >= 18 years'
      }
    };
  })
  .controller('PartiesCtrl', function($rootScope) {
    $rootScope.active = 'parties';
  })
  .controller('AboutCtrl', function($rootScope) {
    $rootScope.active = 'about';
  })
  .controller('ContactCtrl', function() {
  });