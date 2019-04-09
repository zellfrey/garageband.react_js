class LikeSerializer < ActiveModel::Serializer
  attributes :id, :admirer_id, :project_id

  belongs_to :admirer, class_name: 'User'
end
