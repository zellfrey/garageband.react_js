class ProjectSerializer < ActiveModel::Serializer
  attributes :id, :name, :image, :description, :width, :height, :amount_of_notes, :tempo

  belongs_to :author, class_name: "User"
  has_many :rectangles
  has_many :notes, through: :rectangles

  has_many :likes
  has_many :admirers, through: :likes, class_name: "User"
end
