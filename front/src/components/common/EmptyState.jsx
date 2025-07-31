import React from 'react';
import { FiInbox } from 'react-icons/fi';

export default function EmptyState({
  title = "Aucun élément trouvé",
  description = "Essayez de modifier vos critères de recherche",
  icon = "inbox",
  action
}) {
  const icons = {
    inbox: <FiInbox className="mx-auto h-12 w-12 text-gray-400" />,
    users: <FiUser className="mx-auto h-12 w-12 text-gray-400" />,
    search: <FiSearch className="mx-auto h-12 w-12 text-gray-400" />
  };

  return (
    <div className="text-center py-12">
      {icons[icon] || icons.inbox}
      <h3 className="mt-2 text-lg font-medium text-gray-900">{title}</h3>
      <p className="mt-1 text-sm text-gray-500">{description}</p>
      {action && (
        <div className="mt-6">
          {action}
        </div>
      )}
    </div>
  );
}