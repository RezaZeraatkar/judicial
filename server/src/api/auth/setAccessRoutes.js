const handleError = require("../../utils/handleError");

require("dotenv").config();
/**
 *
 * @param {req} req
 * @param {res} res
 * @param {next} next
 * @returns passes authorized_routes to next middleware through express req object
 */
async function setAccessRoutes(req, res, next) {
  const { userId, db } = req;
  const authorized_routes = [];

  if (!userId) {
    return handleError(
      res,
      "احتمالا دسترسی شما به برنامه قطع شده است! لطفا مجدد ورود کنید.",
      403,
    );
  }
  try {
    // security check
    const [users, fields] = await db.execute(
      `SELECT * FROM users WHERE id = "${userId}"`,
    );

    if (users.length <= 0) {
      return handleError(res, "کاربر با این مشخصات وجود ندارد!", 401);
    }

    const [user_access_routes] = await db.execute(
      `SELECT 
          r.id, 
          r.roue_path, 
          r.roue_title, 
          r.parent_route_id,
          uar.show_permission,
          uar.add_permission,
          uar.edit_permission,
          uar.print_permission,
          uar.remove_permission
        FROM routes r 
        LEFT OUTER JOIN user_access_routes uar 
        ON r.id = uar.route_id 
        WHERE uar.user_id = ${userId} ORDER BY r.route_sort ASC;`,
    );
    const [parent_routes] = await db.execute(
      `SELECT pr.id, pr.route_title FROM parent_routes pr ORDER BY pr.route_sort ASC;`,
    );
    parent_routes.forEach((parent_route) => {
      const userAccessRoutes = [];
      user_access_routes.forEach((route) => {
        if (route.parent_route_id === parent_route.id) {
          userAccessRoutes.push({
            route_id: route.id,
            roue_path: route.roue_path,
            roue_title: route.roue_title,
            parent_route_id: route.parent_route_id,
            show_permission: route.show_permission,
            add_permission: route.add_permission,
            edit_permission: route.edit_permission,
            print_permission: route.print_permission,
            remove_permission: route.remove_permission,
          });
        }
      });
      if (userAccessRoutes.length > 0) {
        authorized_routes.push({
          pId: parent_route.id,
          pTitle: parent_route.route_title,
          sub_routes: userAccessRoutes,
        });
      }
    });
    req.authorized_routes = authorized_routes;
    next();
  } catch (error) {
    console.error(error);
    return handleError(res, "خطای سرور هنگام ورود کاربر", 500);
  }
}
module.exports = setAccessRoutes;
