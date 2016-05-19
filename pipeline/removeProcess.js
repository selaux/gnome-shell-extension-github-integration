import * as t from 'babel-types';

export default function () {
  return {
    visitor: {
      Identifier(path) {
        if (path.node.name === 'process' && path.node.type === 'Identifier') {
          if (path.parentPath.node.type === 'MemberExpression') {
            let pathToReplace = path.parentPath;

            while (pathToReplace.parentPath.node.type === 'MemberExpression') {
              pathToReplace = pathToReplace.parentPath;
            }

            pathToReplace.replaceWith(t.nullLiteral());
          }
        }
      }
    }
  };
}
