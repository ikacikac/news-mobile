/**
 *
 * ownCloud - News
 *
 * @author Ilija Lazarevic
 * @copyright 2013 Ilija Lazarevic ikac.ikax@gmail.com
 *
 * This library is free software; you can redistribute it and/or
 * modify it under the terms of the GNU AFFERO GENERAL PUBLIC LICENSE
 * License as published by the Free Software Foundation; either
 * version 3 of the License, or any later version.
 *
 * This library is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU AFFERO GENERAL PUBLIC LICENSE for more details.
 *
 * You should have received a copy of the GNU Affero General Public
 * License along with this library.  If not, see <http://www.gnu.org/licenses/>.
 */

angular.module('News').controller('LoginController',
    ['$scope', '$location', '$route' , '$locale', 'LoginService', 'UserService', 'ExceptionsService',
        function ($scope, $location, $route, $locale, LoginService, UserService, ExceptionsService) {

            UserService.retrieveFromStorage();
            $scope.data = UserService;

            $scope.testFormFields = function () {
                var hostNameRegExp = new RegExp(/^https?/); ///^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/

                if (UserService.hostName.length > 0) {
                    if (UserService.hostName.slice(-1) === '/') {
                        UserService.hostName = UserService.hostName.substring(0, UserService.hostName.length - 1);
                    }
                }

                var hostNameParseResult = hostNameRegExp.test(UserService.hostName);

                if (!hostNameParseResult) {
                    UserService.hostName = 'http://' + UserService.hostName;
                    hostNameParseResult = true;
                }

                if (hostNameParseResult) {
                    return true;
                }
                return false;
            };

            $scope.logIn = function () {
                if ($scope.testFormFields()) {
                    LoginService.logIn()
                        .success(function (data, status) {
                            if (status === 200) {
                                UserService.storeToStorage();
                                LoginService.present = true;
                                $location.path("/");
                            }
                        })
                        .error(function (data, status) {
                            ExceptionsService.makeNewException(data, status);
                        });
                }
            };

            $scope.isLoggedIn = function () {
                if (LoginService.present) {
                    $location.path("/");
                }
            };

        }]);
