angular.module('services.session', [])

.factory('session', ['$location', 'ipCookie', '$q', function($location, $cookie, $q) {
  function setSession(session) {
    localStorage.setItem('session', angular.toJson(session));
    // $cookie('session', session);
  }

  function getSession() {
    // var session = $cookie('session');
    var session = angular.fromJson(localStorage.getItem('session'));
    return session;
  }

  function removeSession() {
    localStorage.removeItem('session');
    // $cookie.remove('session');
  }

  function setUser(user) {
    localStorage.setItem('user', angular.toJson(user));
    // $cookie('user', user);
  }

  function getUser() {
    // var user = $cookie('user');
    var user = angular.fromJson(localStorage.getItem('user'));
    return user;
  }

  function removeUser() {
    localStorage.removeItem('user');
    // $cookie.remove('user');
  }

  return {
    currentUser: null,
    currentSession: null,
    login: function(session, user) {
      setSession(session);
      setUser(user);
      this.currentSession = getSession();
      this.currentUser = getUser();
    },
    logout: function() {
      removeSession();
      removeUser();
      this.currentSession = null;
      this.currentUser = null;
    },
    isAuthenticated: function() {
      try {
        if (this.currentSession.user === this.currentUser._id)
          return true;
        else
          return false;
      }
      catch (err) {
        return false;
      }
    },
    isAdmin: function() {
      try {
        var admin = false;
        angular.forEach(this.currentUser.roles, function(role) {
          if (role === 'admin')
            admin = true;
        });
        if (admin)
          return true;
        return false;
      }
      catch (err) {
        return false;
      }
    },
    isRoot: function() {
      try {
        var root = false;
        angular.forEach(this.currentUser.roles, function(role) {
          if (role === 'root')
            root = true;
        });
        if (root)
          return true;
        return false;
      }
      catch (err) {
        return false;
      }
    },
    requestPermission: function(level) {
      var permission = false;
      if (this.isAuthenticated()) {
        if (level === 'root') {
          permission = this.isRoot();
        }
        else if (level === 'admin') {
          permission = this.isAdmin();
        }
        else if (level === 'user') {
          permission = true;
        }
      }
      if (permission)
        return permission;
      $location.path('/');
      return $q.reject();
    },
    requestCurrentUser: function() {
      this.currentSession = getSession() || null;
      this.currentUser = getUser() || null;
    }
  };
}]);
